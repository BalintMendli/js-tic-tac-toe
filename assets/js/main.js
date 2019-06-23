const gameBoard = (() => {
  const board = [];
  const setPosition = (i, s) => (board[i] = s);
  const getPosition = i => board[i];
  const isFull = () => board.filter(e => e).length === 9;
  const winningSets = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  const hasWinningPositionsbyPlayer = sign => {
    const playerPositions = board.map((el, i) => (el === sign ? i : null));
    return winningSets.some(winningSet =>
      winningSet.every(pos => playerPositions.includes(pos))
    );
  };
  const reset = () => (board.length = 0);
  return {
    setPosition,
    getPosition,
    isFull,
    hasWinningPositionsbyPlayer,
    reset,
    board
  };
})();

const Player = (name, sign) => {
  const getName = () => name;
  const getSign = () => sign;
  const makeMove = i => {
    if (!gameBoard.getPosition(i)) {
      gameBoard.setPosition(i, getSign());
      return true;
    }
  };
  return { getName, getSign, makeMove };
};

const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');

const displayController = (() => {
  const getCellNodes = () => {
    const cells = document.querySelectorAll('.cell');
    return [...cells];
  };
  const setup = () => {
    getCellNodes().forEach((cell, i) => {
      cell.addEventListener('click', () => game.turn(i));
    });
    document.querySelector('.new-game').addEventListener('click', game.restart);
  };
  const renderBoard = () => {
    getCellNodes().forEach((cell, i) => {
      const cellCont = gameBoard.getPosition(i);
      cell.innerText = cellCont ? cellCont : '';
    });
  };
  const showResult = winner => {
    const text = winner ? `${winner} has won!` : "It's a tie!";
    const messages = document.querySelector('.messages');
    messages.innerText = text;
  };
  return { setup, renderBoard, showResult };
})();

const game = (() => {
  let currPlayer = player1;
  let isOn = true;
  const turn = i => {
    if (isOn) {
      const move = currPlayer.makeMove(i);
      if (move) {
        displayController.renderBoard();
        if (gameBoard.isFull()) end();
        if (gameBoard.hasWinningPositionsbyPlayer(currPlayer.getSign()))
          end(currPlayer.getName());
        switchPlayer();
      }
    }
  };
  const switchPlayer = () => {
    currPlayer = currPlayer === player1 ? player2 : player1;
  };
  const start = () => {
    displayController.setup();
  };
  const restart = () => {
    gameBoard.reset();
    displayController.renderBoard();
    currPlayer = player1;
    isOn = true;
  };
  const end = winner => {
    displayController.showResult(winner);
    isOn = false;
  };
  return { turn, start, restart };
})();

game.start();
