const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImg = new Image();
playerImg.src = 'imagenes/nave.png';

const alienImg = new Image();
alienImg.src = 'imagenes/alien.png';

const explosionImg = new Image();
explosionImg.src = 'imagenes/explosion.png';

const laserSound = new Audio('sonidos/laser.mp3');
const explosionSound = new Audio('sonidos/explosion.mp3');
const gameOverSound = new Audio('sonidos/game-over.mp3');
const victorySound = new Audio('sonidos/victoria.mp3');

// === ENTIDADES ===
let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 7
};

let bullets = [];
let aliens = [];
let explosions = [];

let score = 0;
let gameOver = false;
let victory = false;

// === CREAR ALIENS ===
const rows = 3;
const cols = 8;
const alienSpacing = 80;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    aliens.push({
      x: 80 + c * alienSpacing,
      y: 50 + r * 60,
      width: 40,
      height: 40,
      dx: 2
    });
  }
}

// === CONTROLES ===
let keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;

  if (e.code === 'Space') {
    shoot();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// === DISPARAR ===
function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y,
    width: 4,
    height: 20,
    speed: 8
  });
  laserSound.currentTime = 0;
  laserSound.play();
}

// === DIBUJAR ENTIDADES ===
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawAliens() {
  aliens.forEach(alien => {
    ctx.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
  });
}

function drawBullets() {
  ctx.fillStyle = 'red';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
}

function drawExplosions() {
  explosions.forEach(ex => {
    ctx.drawImage(explosionImg, ex.x, ex.y, 40, 40);
  });
}

// === ACTUALIZAR ESTADO ===
function update() {
  if (gameOver || victory) return;

  // Movimiento jugador
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Movimiento balas
  bullets = bullets.filter(b => b.y > 0);
  bullets.forEach(b => b.y -= b.speed);

  // Movimiento alienígenas
  let hitEdge = false;
  aliens.forEach(a => {
    a.x += a.dx;
    if (a.x <= 0 || a.x + a.width >= canvas.width) {
      hitEdge = true;
    }
  });

  if (hitEdge) {
    aliens.forEach(a => {
      a.dx *= -1;
      a.y += 20;
      // Si llegan abajo: GAME OVER
      if (a.y + a.height >= player.y) {
        endGame(false);
      }
    });
  }

  // Colisiones
  bullets.forEach((b, bi) => {
    aliens.forEach((a, ai) => {
      if (
        b.x < a.x + a.width &&
        b.x + b.width > a.x &&
        b.y < a.y + a.height &&
        b.y + b.height > a.y
      ) {
        // Eliminar bala y alien
        bullets.splice(bi, 1);
        aliens.splice(ai, 1);
        explosions.push({ x: a.x, y: a.y, frames: 15 });
        score += 10;
        explosionSound.currentTime = 0;
        explosionSound.play();
      }
    });
  });

  // Explosiones (temporales)
  explosions = explosions.filter(e => {
    e.frames--;
    return e.frames > 0;
  });

  if (aliens.length === 0) {
    endGame(true);
  }
}

// === GAME OVER / VICTORIA ===
function endGame(won) {
  gameOver = !won;
  victory = won;
  if (won) {
    victorySound.play();
  } else {
    gameOverSound.play();
  }
}

// === MOSTRAR TEXTO FINAL ===
function drawEndText() {
  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  if (victory) {
    ctx.fillText("¡Victoria! La humanidad ha sido salvada", canvas.width / 2, canvas.height / 2);
  } else {
    ctx.fillText("GAME OVER - La humanidad ha caído", canvas.width / 2, canvas.height / 2);
  }
}

// === DIBUJAR MARCADOR ===
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Puntos: ${score}`, 10, 30);
}

// === BUCLE PRINCIPAL ===
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  drawPlayer();
  drawAliens();
  drawBullets();
  drawExplosions();
  drawScore();

  if (gameOver || victory) {
    drawEndText();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

gameLoop(); // ¡Comienza el juego!
