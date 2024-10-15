let currentPlayer;
let cpuPlayer;
let board = ["", "", "", "", "", "", "", "", ""];
let countX = 0;
let countO = 0;
let gameOver = false;

document.getElementById("btnNewGame").addEventListener("click", function () {
  startGame();
});

document.getElementById("btnStartGame").addEventListener("click", function () {
  initializeGame();
});

document.getElementById("btnResetGame").addEventListener("click", function () {
  resetGame();
});

document
  .getElementById("game-board")
  .addEventListener("click", function (event) {
    playerMove(event);
  });

function startGame() {
  document.getElementById("homePage").style.display = "none";
  document.getElementById("pickPlayer").style.display = "block";
}

function initializeGame() {
  document.getElementById("pickPlayer").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  const selectedMark = document.querySelector(
    'input[name="playerMark"]:checked'
  ).value;

  if (selectedMark === "X") {
    currentPlayer = "X";
    cpuPlayer = "O";
    document.querySelector(".pill:nth-child(1) p").textContent = "X (YOU)";
    document.querySelector(".pill:nth-child(2) p").textContent = "O (CPU)";
  } else {
    currentPlayer = "O";
    cpuPlayer = "X";
    document.querySelector(".pill:nth-child(1) p").textContent = "O (YOU)";
    document.querySelector(".pill:nth-child(2) p").textContent = "X (CPU)";
    setTimeout(cpuMove, 5000);
  }
  updateTurn();
}

function updateTurn() {
  const turnIcons = document.querySelector(".turn img");

  turnIcons.src = `assets/icons/${currentPlayer.toLowerCase()}.svg`;
  countX = currentPlayer === "X" ? countX + 1 : countX;
  countO = currentPlayer === "O" ? countO + 1 : countO;
  updatePillCounts();
}

// move player

function playerMove(event) {
  if (gameOver) return; // Stop accepting moves if the game is over

  const cellIndex = event.target.dataset.index;

  // Check if the cell is empty
  if (board[cellIndex] === "") {
    board[cellIndex] = currentPlayer;
    const cell = event.target;
    cell.innerHTML = `<img src="assets/icons/${currentPlayer.toLowerCase()}.svg" alt="${currentPlayer}">`;

    // Check for a win or a draw
    if (checkWin()) {
      endGame("YOU WON!", "WON THIS ROUND", currentPlayer);
    } else if (boardFull()) {
      endGame("NOBODY WIN!", "THIS GAME IS A TIE.", null);
    } else {
      // Switch turns
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateTurn();

      // If it's the CPU's turn, make a move after a delay
      if (currentPlayer === cpuPlayer) {
        setTimeout(cpuMove, 1000);
      }
    }
  }
}

function cpuMove() {
  if (gameOver) return; // Stop CPU moves if the game is over

  // Implement your CPU logic here to make strategic moves
  // For simplicity, let's just make a random move for now
  let emptyCells = board.reduce((acc, cell, index) => {
    if (cell === "") acc.push(index);
    return acc;
  }, []);

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cpuMoveIndex = emptyCells[randomIndex];

    board[cpuMoveIndex] = cpuPlayer;
    const cpuCell = document.querySelector(
      `.cell[data-index="${cpuMoveIndex}"]`
    );
    cpuCell.innerHTML = `<img src="assets/icons/${cpuPlayer.toLowerCase()}.svg" alt="${cpuPlayer}">`;

    // Check for a win or a draw
    if (checkWin()) {
      endGame("CPU WON!", "WON THIS ROUND", cpuPlayer);
    } else if (boardFull()) {
      endGame("NOBODY WIN!", "THIS GAME IS A TIE", null);
    } else {
      // Switch turns
      currentPlayer = cpuPlayer === "X" ? "O" : "X";
      updateTurn();
    }
  }
}

// Add this function to update the counts on the pills
function updatePillCounts() {
  document.getElementById("countX").textContent = countX;
  document.getElementById("countO").textContent = countO;
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }

  return false;
}

function boardFull() {
  return board.every((cell) => cell !== "");
}

function endGame(title, message, winner, winningCells) {
  gameOver = true;
  displayModal(title, message, winner);
  highlightWinningCells(winningCells);
}

function displayModal(title, message, winner) {
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");

  modalTitle.textContent = title;

  if (winner === "O") {
    modalMessage.innerHTML = `<img src="assets/icons/o.svg" alt="">${message}`;
    modalMessage.style.color = "#fec106"; // Color for O (Player) win
  } else if (winner === "X") {
    modalMessage.innerHTML = `<img src="assets/icons/x.svg" alt="">${message}`;
    modalMessage.style.color = "#4fc3f9"; // Color for X (CPU) win
  } else {
    modalMessage.innerHTML = `${message}`;
    modalMessage.style.color = "#fff";
  }

  document.getElementById("bntQuit").addEventListener("click", gameQuit);
  document.getElementById("modalButton").addEventListener("click", closeModal);

  document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
  resetGame();
}
function gameQuit(params) {
  window.close();
}
function resetGame() {
  document.getElementById("myModal").style.display = "none";
  document.getElementById("pickPlayer").style.display = "block";
  document.getElementById("gameContainer").style.display = "none";
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  countX = 0;
  countO = 0;
  gameOver = false;

  // Clear the board
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.textContent = "";
  });
}
function highlightWinningCells(winningCells) {
  if (winningCells) {
    winningCells.forEach((index) => {
      const cell = document.querySelector(`.cell[data-index="${index}"]`);
      cell.classList.add("winning-cell");
    });
  }
}
