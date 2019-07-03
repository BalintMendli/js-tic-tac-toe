const gameBoard = (() => {
  const board = [];
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
  const reset = () => (board.length = 0);
  const isFull = () => board.filter(e => e).length === 9;
  const hasWinningPositionsbyPlayer = player => {
    const sign = player.sign;
    const playerPositions = board.map((el, i) => (el === sign ? i : null));
    return winningSets.some(winningSet =>
      winningSet.every(pos => playerPositions.includes(pos))
    );
  };
  return {
    board,
    isFull,
    hasWinningPositionsbyPlayer,
    reset
  };
})();

const Player = (name, sign) => {
  const makeMove = i => {
    if (!gameBoard.board[i]) {
      gameBoard.board[i] = sign;
      return true;
    }
  };
  return { name, sign, makeMove };
};

const displayController = (() => {
  const setup = () => {
    [...document.querySelectorAll('.cell')].forEach((cell, i) => {
      cell.addEventListener('click', () => game.turn(i));
    });
    document
      .querySelector('.new-game')
      .addEventListener('click', game.initNewGame);
    document
      .querySelector('.start')
      .addEventListener('click', game.startRestart);
  };
  const renderBoard = () => {
    [...document.querySelectorAll('.cell')].forEach((cell, i) => {
      const cellCont = gameBoard.board[i];
      cell.innerText = cellCont ? cellCont : '';
    });
  };
  const setupNewGame = () => {
    renderBoard();
    clearMessages();
    showInputs();
  };
  const clearMessages = () => {
    document.querySelector('.messages').innerText = '';
  };
  const showResult = winner => {
    const text = winner ? `${winner.name} has won!` : "It's a draw!";
    document.querySelector('.messages').innerText = text;
  };
  const showInputs = () => {
    document.querySelector('.name-inputs').classList.remove('hide');
    document.querySelector('.new-game').classList.add('hide');
  };
  const hideInputs = () => {
    document.querySelector('.name-inputs').classList.add('hide');
    document
      .querySelectorAll('.name-inputs input')
      .forEach(input => (input.value = ''));
    document.querySelector('.new-game').classList.remove('hide');
  };
  const getNames = () => {
    const inputs = document.querySelectorAll('.name-inputs input');
    return [...inputs].map((input, i) => input.value || `Player ${i + 1}`);
  };
  const showTurn = player => {
    const name = player.name;
    const sign = player.sign;
    document.querySelector('.messages').innerText = `${name}'s turn: (${sign})`;
  };
  return {
    setup,
    renderBoard,
    showResult,
    hideInputs,
    getNames,
    showTurn,
    setupNewGame
  };
})();

const game = (() => {
  let player1;
  let player2;
  let isOn = false;
  let currPlayer;
  const start = () => {
    displayController.setup();
  };
  const initNewGame = () => {
    isOn = false;
    gameBoard.reset();
    displayController.setupNewGame();
  };
  const startRestart = () => {
    const playerNames = displayController.getNames();
    player1 = Player(playerNames[0], 'X');
    player2 = Player(playerNames[1], 'O');
    displayController.hideInputs();
    currPlayer = player1;
    displayController.showTurn(currPlayer);
    isOn = true;
  };
  const switchPlayer = () => {
    currPlayer = currPlayer === player1 ? player2 : player1;
  };
  const turn = i => {
    if (isOn) {
      const move = currPlayer.makeMove(i);
      if (move) {
        displayController.renderBoard();
        if (gameBoard.isFull()) {
          end();
          return;
        }
        if (gameBoard.hasWinningPositionsbyPlayer(currPlayer)) {
          end(currPlayer);
          return;
        }
        switchPlayer();
        displayController.showTurn(currPlayer);
      }
    }
  };
  const end = winner => {
    displayController.showResult(winner);
    isOn = false;
  };
  return { turn, start, startRestart, initNewGame };
})();

game.start();
