import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./sapper.js";

const BOARD_SIZE = 16;
const NUMBER_OF_MINES = 40;

let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const mainBtn = document.querySelector(".main-button");

const initBoard = () => {
  board.forEach((row) => {
    row.forEach((tile) => {
      boardElement.append(tile.element);
      tile.element.addEventListener("click", () => {
        if (!isGameOver) {
          revealTile(board, tile);
          checkGameEnd();
          startTimer();
        }
      });
      tile.element.addEventListener("contextmenu", (e) => {
        if (!isGameOver) {
          e.preventDefault();
          markTile(tile);
          listMinesLeft();
        }
      });
    });
  });
};
initBoard();
boardElement.style.setProperty("--size", BOARD_SIZE);

const numPos = [26, 0, 250, 222, 194, 166, 138, 110, 82, 54];

const listMinesLeft = () => {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);
  const minesArr = String(NUMBER_OF_MINES - markedTilesCount)
    .padStart(3, "0")
    .split("");
  document.querySelector(".counter-item-01").style.backgroundPosition = `${
    numPos[minesArr[0]]
  }px 0`;
  document.querySelector(".counter-item-02").style.backgroundPosition = `${
    numPos[minesArr[1]]
  }px 0`;
  document.querySelector(".counter-item-03").style.backgroundPosition = `${
    numPos[minesArr[2]]
  }px 0`;
};
listMinesLeft();

let timer = 0;
let isTimerStarted = false;
let set_interval_id;
const startTimer = () => {
  if (!isTimerStarted) {
    isTimerStarted = true;
    set_interval_id = setInterval(() => {
      timer += 1;
      const timerArr = String(timer).padStart(3, "0").split("");
      document.querySelector(".time-counter-01").style.backgroundPosition = `${
        numPos[timerArr[0]]
      }px 0`;
      document.querySelector(".time-counter-02").style.backgroundPosition = `${
        numPos[timerArr[1]]
      }px 0`;
      document.querySelector(".time-counter-03").style.backgroundPosition = `${
        numPos[timerArr[2]]
      }px 0`;
    }, 1000);
  }
};

const resetTimer = () => {
  timer = 0;
  document.querySelector(
    ".time-counter-01"
  ).style.backgroundPosition = `26px 0`;
  document.querySelector(
    ".time-counter-02"
  ).style.backgroundPosition = `26px 0`;
  document.querySelector(
    ".time-counter-03"
  ).style.backgroundPosition = `26px 0`;
};

let isGameOver = false;

const checkGameEnd = () => {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    isGameOver = true;
    clearInterval(set_interval_id);
  }

  if (win) {
    // messageText.textContent = "You win!";
    mainBtn.style.backgroundPosition = "115px 118px";
  }

  if (lose) {
    // messageText.textContent = "You lose!";
    mainBtn.style.backgroundPosition = "60px 118px";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
};

const resetGame = () => {
  isGameOver = false;
  isTimerStarted = false;
  clearInterval(set_interval_id);
  resetTimer();
  mainBtn.style.backgroundPosition = "-2px 118px";
  boardElement.innerHTML = "";
  board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
  initBoard();
  listMinesLeft();
};
mainBtn.addEventListener("click", resetGame);
