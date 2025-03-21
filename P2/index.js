// index.js
let claveSecreta = [];
let intentosRestantes = 10;
let intervalo;

// Selección de elementos
const claveElementos = document.querySelectorAll(".clave span");
const displayIntentos = document.getElementById("display");
const contador = document.getElementById("contador");
const botonesNumeros = document.querySelectorAll(".num-btn");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const crono = new Crono(contador);

// Genera una nueva clave secreta
function generarClaveSecreta() {
    claveSecreta = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    console.log("Clave generada:", claveSecreta); // Debug
}

generarClaveSecreta();

function reiniciarJuego() {
    crono.reset();
    intentosRestantes = 10;
    displayIntentos.textContent = "Intentos restantes: 10";
    claveElementos.forEach(el => {
        el.textContent = "*";
        el.style.color = "red";
    });
    generarClaveSecreta();
}

botonesNumeros.forEach(boton => {
    boton.addEventListener("click", () => {
        if (intentosRestantes > 0) {
            if (!crono.timer) crono.start();
            let num = parseInt(boton.textContent);
            claveSecreta.forEach((valor, i) => {
                if (valor === num) {
                    claveElementos[i].textContent = num;
                    claveElementos[i].style.color = "green";
                }
            });
            intentosRestantes--;
            displayIntentos.textContent = `Intentos restantes: ${intentosRestantes}`;
            
            // Comprobar si se ha adivinado toda la clave
            if ([...claveElementos].every(el => el.textContent !== "*")) {
                // Asegurar que la clave se actualiza antes del mensaje de victoria
                setTimeout(() => {
                    alert("¡Felicidades! Has adivinado la clave secreta");
                    reiniciarJuego();
                }, 500);
            }
        }
        
        if (intentosRestantes === 0) {
            alert("Has agotado los intentos. ¡Inténtalo de nuevo!");
            reiniciarJuego();
        }
    });
});

startBtn.addEventListener("click", () => crono.start());
stopBtn.addEventListener("click", () => crono.stop());
resetBtn.addEventListener("click", reiniciarJuego);
