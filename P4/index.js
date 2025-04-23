const board = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const sizeSelect = document.getElementById("size");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const message = document.getElementById("message");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let gameStarted = false;
let moves = 0;
let time = 0;
let timerInterval = null;
let boardSize = 4;
let totalPairs = 0;
let matchedPairs = 0;

const emojis = ['🥑','🍍','🌽','🥔','🍎','🍇','🍓','🍌','🍊','🍉','🥝','🍒','🥥','🫐','🍆','🌶','🥕','🥒'];

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
sizeSelect.addEventListener("change", () => {
  if (!gameStarted) {
    boardSize = parseInt(sizeSelect.value);
  }
});

function startGame() {
    const music = document.getElementById("bg-music");
  if (music && music.paused) {
    music.play().catch(err => {
      console.log("La reproducción automática fue bloqueada. El usuario debe interactuar.");
    });
}

  boardSize = parseInt(sizeSelect.value); // asegurar valor correcto
  resetBoard();
  gameStarted = true;
  startBtn.disabled = true;
  sizeSelect.disabled = true;
  resetBtn.disabled = false;
  createBoard();
  startTimer();
}

function resetGame() {
  clearInterval(timerInterval);
  gameStarted = false;
  startBtn.disabled = false;
  sizeSelect.disabled = false;
  resetBtn.disabled = true;
  resetBoard();
  board.innerHTML = "";
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  time = 0;
  matchedPairs = 0;
  totalPairs = (boardSize * boardSize) / 2;
  movesDisplay.textContent = moves;
  timeDisplay.textContent = time;
  message.classList.add("hidden");
  board.innerHTML = "";
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    timeDisplay.textContent = time;
  }, 1000);
}

function createBoard() {
  const selectedEmojis = emojis.slice(0, totalPairs);
  const cards = [...selectedEmojis, ...selectedEmojis].sort(() => 0.5 - Math.random());

  board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

  cards.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerHTML = `<span class="front">❓</span><span class="back">${emoji}</span>`;
    card.addEventListener("click", handleCardClick);
    board.appendChild(card);
  });
}

function handleCardClick() {
  if (lockBoard || this.classList.contains("matched") || this === firstCard) return;

  this.classList.add("flipped");

  if (!gameStarted) {
    startGame();
  }

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.textContent = moves;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      clearInterval(timerInterval);
      setTimeout(() => {
        message.classList.remove("hidden");
        message.textContent = `¡Ganaste en ${moves} movimientos y ${time} segundos!`;
      }, 500);
    }
    resetTurn();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
