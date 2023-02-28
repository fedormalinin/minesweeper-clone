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

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const messageText = document.querySelector(".subtext");

const boardElement = document.querySelector(".board");

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
  });
});
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
  // console.log(`${String(numPos[minesArr[2]])} 0`);
  document.querySelector(".counter-item-01").style.backgroundPosition = `${
    numPos[Number(minesArr[0])]
  }px 0`;
  document.querySelector(".counter-item-02").style.backgroundPosition = `${
    numPos[Number(minesArr[1])]
  }px 0`;
  document.querySelector(".counter-item-03").style.backgroundPosition = `${
    numPos[Number(minesArr[2])]
  }px 0`;
};
listMinesLeft();
const checkGameEnd = () => {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = "You win!";
  }

  if (lose) {
    messageText.textContent = "You lose!";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
};

const stopProp = (e) => {
  e.stopImmediatePropagation();
};
