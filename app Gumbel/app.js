function ejecutarModelo() {
    // 1. Extracción de variables de entrada
    const modelo = document.getElementById("modelo").value;
    const mu = parseFloat(document.getElementById("media").value);
    const varianza = parseFloat(document.getElementById("varianza").value);
    const x = parseFloat(document.getElementById("valorX").value);

    // Validación lógica de datos
    if (isNaN(mu) || isNaN(varianza) || isNaN(x)) {
        alert("Error lógico: Se requieren variables numéricas reales para proceder.");
        return;
    }

    // 2. Definición de constantes y parámetros fundamentales
    const c = 0.5772; // Constante de Euler-Mascheroni
    // Despeje de beta desde la varianza: σ² = (π²/6) * β² => β = sqrt((6 * σ²) / π²)
    const beta = Math.sqrt((varianza * 6) / Math.pow(Math.PI, 2));
    
    let theta;
    let salidaProb = "";

    // 3. Resolución matemática según el modelo seleccionado
    if (modelo === "maximo") {
        // Gumbel Máximo
        theta = mu - (beta * c);
        
        // Fx(x) = P(X <= x) = e^(-e^(-(x-theta)/beta))
        const probAcumulada = Math.exp(-Math.exp(-(x - theta) / beta));
        
        salidaProb = `<strong>Probabilidad acumulada P(X ≤ x):</strong> ${probAcumulada.toFixed(6)} <br>
                      <strong>Probabilidad de excedencia P(X > x):</strong> ${(1 - probAcumulada).toFixed(6)}`;
    } else {
        // Gumbel Mínimo
        theta = mu + (beta * c);
        
        // Gx(x) = P(X > x) = e^(-e^((x-theta)/beta))
        const probExcedencia = Math.exp(-Math.exp((x - theta) / beta));
        const probIzquierda = 1 - probExcedencia;

        salidaProb = `<strong>Probabilidad de excedencia P(X > x):</strong> ${probExcedencia.toFixed(6)} <br>
                      <strong>Probabilidad acumulada P(X ≤ x):</strong> ${probIzquierda.toFixed(6)}`;
    }

    // 4. Inyección de resultados en la interfaz
    document.getElementById("salidaParametros").innerHTML = `
        Parámetro de escala (β): ${beta.toFixed(4)} <br>
        Parámetro de corrimiento/moda (θ): ${theta.toFixed(4)}
    `;
    document.getElementById("salidaProbabilidad").innerHTML = salidaProb;
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito. Scope:', registration.scope);
      })
      .catch(error => {
        console.log('Fallo en el registro del Service Worker:', error);
      });
  });
}