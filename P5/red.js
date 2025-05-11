
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnGenerar = document.getElementById("btnGenerar");
const btnCalcular = document.getElementById("btnCalcular");
const nodosInfo = document.getElementById("nodosInfo");
const tiempoInfo = document.getElementById("tiempoInfo");
const mensaje = document.getElementById("mensaje");

let nodos = [];
let grafo = {};
let generado = false;

btnGenerar.addEventListener("click", generarRed);
btnCalcular.addEventListener("click", calcularRuta);

function generarRed() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodos = [];
  grafo = {};
  generado = true;

  for (let i = 0; i < 5; i++) {
    nodos.push({
      id: `N${i}`,
      delay: Math.floor(Math.random() * 300) + 250,
      x: 100 + i * 130,
      y: Math.random() * 150 + 100
    });
  }

  nodos.forEach(nodo => {
    grafo[nodo.id] = {};
  });

  for (let i = 0; i < nodos.length; i++) {
    while (Object.keys(grafo[nodos[i].id]).length < 2) {
      let target = nodos[Math.floor(Math.random() * nodos.length)];
      if (target.id !== nodos[i].id && !grafo[nodos[i].id][target.id]) {
        const peso = Math.floor(Math.random() * 200) + 100;
        grafo[nodos[i].id][target.id] = peso;
        grafo[target.id][nodos[i].id] = peso;
      }
    }
  }

  nodosInfo.textContent = `${nodos.length} nodos`;
  mensaje.textContent = "Red generada correctamente";
  tiempoInfo.textContent = "tiempo total: 0 sec";

  dibujarRed();
}

function dibujarRed(ruta = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodos.forEach(n1 => {
    for (let n2 in grafo[n1.id]) {
      const target = nodos.find(n => n.id === n2);
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = "#aaa";
      ctx.stroke();

      const midX = (n1.x + target.x) / 2;
      const midY = (n1.y + target.y) / 2;
      ctx.fillStyle = "black";
      ctx.fillText(`${grafo[n1.id][n2]} px`, midX, midY);
    }
  });

  nodos.forEach(nodo => {
    ctx.beginPath();
    ctx.arc(nodo.x, nodo.y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = ruta.includes(nodo.id) ? "green" : "blue";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fillText(`${nodo.id} delay ${nodo.delay}`, nodo.x - 25, nodo.y + 5);
  });
}

function calcularRuta() {
  if (!generado) {
    mensaje.textContent = "La red no está generada. Por favor generar primero la red.";
    mensaje.style.color = "red";
    return;
  }

  const start = nodos[0].id;
  const end = nodos[nodos.length - 1].id;
  const ruta = dijkstra(grafo, start, end);

  if (ruta.length === 0) {
    mensaje.textContent = "No se encontró ruta.";
    return;
  }

  const totalDelay = ruta.reduce((acc, id) => {
    const nodo = nodos.find(n => n.id === id);
    return acc + nodo.delay;
  }, 0);

  dibujarRed(ruta);
  mensaje.textContent = "Ruta mínima calculada";
  tiempoInfo.textContent = `tiempo total: ${totalDelay} sec`;
}
