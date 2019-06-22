const gameBoard = (() => {
  const board = ['x', , '0'];
  const setPosition = (i, s) => (board[i] = s);
  const getPosition = i => board[i];
  return { setPosition, getPosition };
})();

const Player = (name, sign) => {
  const getName = () => name;
  const getSign = () => sign;
  const makeMove = i => {
    if (!gameBoard.getPosition(i)) {
      gameBoard.setPosition(i, getSign());
      displayController.renderBoard();
    }
  };
  return { getName, getSign, makeMove };
};

const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');

const displayController = (() => {
  const setup = () => {
    const cells = document.querySelectorAll('.cell');
    [...cells].forEach((cell, i) => {
      cell.addEventListener('click', () => game.makeMove(i));
    });
  };
  const renderBoard = () => {
    const cells = document.querySelectorAll('.cell');
    [...cells].forEach((cell, i) => {
      const cellCont = gameBoard.getPosition(i);
      if (cellCont) cell.innerText = cellCont;
    });
  };
  return { setup, renderBoard };
})();

const game = (() => {
  const makeMove = i => {
    player1.makeMove(i);
  };
  const start = () => {
    displayController.setup();
    displayController.renderBoard();
    player1.makeMove(8);
    player2.makeMove(0);
  };
  return { makeMove, start };
})();

game.start();
