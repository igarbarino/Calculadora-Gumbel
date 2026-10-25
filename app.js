function ejecutarModelo() {
    const modelo = document.getElementById("modelo").value;
    const x = parseFloat(document.getElementById("valorX").value);
    const mu = parseFloat(document.getElementById("media").value);
    const varianza = parseFloat(document.getElementById("varianza").value);
    const inputTheta = parseFloat(document.getElementById("theta").value);
    const inputBeta = parseFloat(document.getElementById("beta").value);

    // Validación de la variable a evaluar (siempre obligatoria)
    if (isNaN(x)) {
        alert("Error lógico: Se requiere ingresar la variable x.");
        return;
    }

    const c = 0.5772;
    let beta, theta;

    // Lógica de prioridad: Usar θ y β si se ingresaron
    if (!isNaN(inputTheta) && !isNaN(inputBeta)) {
        theta = inputTheta;
        beta = inputBeta;
    } 
    // Si no están, calcular a partir de Media y Varianza
    else if (!isNaN(mu) && !isNaN(varianza)) {
        beta = Math.sqrt((varianza * 6) / Math.pow(Math.PI, 2));
        if (modelo === "maximo") {
            theta = mu - (beta * c);
        } else {
            theta = mu + (beta * c);
        }
    } 
    // Manejo de error si faltan pares de datos
    else {
        alert("Error: Ingrese Media y Varianza, o directamente los parámetros θ y β.");
        return;
    }

    let salidaProb = "";

    // Resolución matemática
    if (modelo === "maximo") {
        const probAcumulada = Math.exp(-Math.exp(-(x - theta) / beta));
        salidaProb = `<strong>Probabilidad acumulada P(X ≤ x):</strong> ${probAcumulada.toFixed(6)} <br>
                      <strong>Probabilidad de excedencia P(X > x):</strong> ${(1 - probAcumulada).toFixed(6)}`;
    } else {
        const probExcedencia = Math.exp(-Math.exp((x - theta) / beta));
        const probIzquierda = 1 - probExcedencia;
        salidaProb = `<strong>Probabilidad de excedencia P(X > x):</strong> ${probExcedencia.toFixed(6)} <br>
                      <strong>Probabilidad acumulada P(X ≤ x):</strong> ${probIzquierda.toFixed(6)}`;
    }

    let esperanza, mediana;
    const lnln2 = Math.log(Math.log(2)); // Constante para el cuantil 50%

    // Cálculo analítico de Esperanza (Media) y Mediana
    if (modelo === "maximo") {
        esperanza = theta + (beta * c);
        mediana = theta - (beta * lnln2);
    } else {
        esperanza = theta - (beta * c);
        mediana = theta + (beta * lnln2);
    }

    // Cálculo de la Varianza a partir del parámetro de escala
    const varianzaCalculada = (Math.pow(Math.PI, 2) / 6) * Math.pow(beta, 2);

    // Inyección de resultados ampliados en la interfaz
    document.getElementById("salidaParametros").innerHTML = `
        Parámetro de escala (β): ${beta.toFixed(4)} <br>
        Parámetro de corrimiento/moda (θ): ${theta.toFixed(4)} <br>
        <strong>Media / Esperanza (μ):</strong> ${esperanza.toFixed(4)} <br>
        <strong>Mediana (x̃):</strong> ${mediana.toFixed(4)} <br>
        <strong>Varianza (σ²):</strong> ${varianzaCalculada.toFixed(4)}
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
