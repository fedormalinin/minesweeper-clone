export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
  QUESTION: "question",
};

export const GAME_STATUSES = {
  DEFAULT: "default",
  ONDEFAULT: "default",
  SCARED: "scared",
  LOSE: "lose",
  WIN: "win",
};

export const FIRST_CLICK = {
  isClickFirst: true,
};

export const createBoard = (boardSize, numberOfMines) => {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.classList.add("tile");
      element.dataset.status = TILE_STATUSES.HIDDEN;
      document.querySelector(".main-button").dataset.status =
        GAME_STATUSES.DEFAULT;
      scareFaceListener();
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
};

export const markTile = (tile) => {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED &&
    tile.status !== TILE_STATUSES.QUESTION
  ) {
    return;
  }
  if (tile.status === TILE_STATUSES.HIDDEN) {
    tile.status = TILE_STATUSES.MARKED;
  } else if (tile.status === TILE_STATUSES.QUESTION) {
    tile.status = TILE_STATUSES.HIDDEN;
  } else {
    tile.status = TILE_STATUSES.QUESTION;
  }
};

// const numbersPosition = [0, -34, -68, -102, -136, -170, 72, 42];

export const revealTile = (board, tile) => {
  if (FIRST_CLICK.isClickFirst && tile.mine) {
    tile.mine = false;
    console.log(board);
  }
  FIRST_CLICK.isClickFirst = false;

  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }
  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);

  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
    // tile.element.style.backgroundPosition = numbersPosition[mines.length];
  }
};

export const checkWin = (board) => {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
};

export const checkLose = (board) => {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
};

const getMinePositions = (boardSize, numberOfMines) => {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }

  return positions;
};

const positionMatch = (a, b) => {
  return a.x === b.x && a.y === b.y;
};

const randomNumber = (size) => {
  return Math.floor(Math.random() * size);
};

const nearbyTiles = (board, { x, y }) => {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
};

const handleMouseOver = (e) => {
  e.target.addEventListener("mousedown", () => {
    document.querySelector(".main-button").dataset.status =
      GAME_STATUSES.SCARED;
  });
  e.target.addEventListener("mouseup", () => {
    document.querySelector(".main-button").dataset.status =
      GAME_STATUSES.DEFAULT;
  });
};

const scareFaceListener = () => {
  const tiles = document.querySelectorAll(".board");
  tiles.forEach((item) => {
    item.addEventListener("mouseover", handleMouseOver);
  });
};
