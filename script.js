//Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories.

/* to do
	1) players click
		a) check if the spot is taken already
		b) submits the symbol to the gameBoard array
		c) checks to see if a win has been made
		d) changes to the next player
*/

// elements
const startGameButton = document.querySelector('#start_game');
const gameSpots = Array.from(document.querySelectorAll('.board-spot'));


// Module for gameboard display (will want to pass in 'symbol' & 'space');
const Gameboard = (() =>  {
	const gameBoard = ['','','','','','','',''];

	let gameTurn = 1;
	
	let playerOne = {};
	let playerTwo = {};
	
	function setPlayers (first, second) {
		playerOne = first;
		playerTwo = second;
	}

	function currentPlayer () {
		if (gameTurn % 2 == 0) {
			return playerTwo.symbol; 
		} else {
			return playerOne.symbol;
		}
	}

	function playerClick (e) {
		this.innerHTML = currentPlayer();
		gameTurn += 1;
	}

	return { gameBoard, playerClick, setPlayers };

})();


// factory function for players
const Player = (name, symbol) => {
	const getName = () => name 
	const getSymbol = () => symbol
	
	return { name, symbol };
};


function toggleBoard () {
	const displayBoard = document.querySelector('table');
	const startButton = document.querySelector('#start_game');
	
	displayBoard.classList.toggle('hidden');
	startButton.classList.toggle('hidden');

	Gameboard.setPlayers(playerOnePick, playerTwoPick);
}



// Event Listeners
startGameButton.addEventListener('click', toggleBoard);

gameSpots.forEach(spot => spot.addEventListener('click', Gameboard.playerClick));


// Default players
const playerOnePick = Player('Margot', "X");
const playerTwoPick = Player('Zeke', 'O');
