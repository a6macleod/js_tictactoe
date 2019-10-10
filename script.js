//Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories.

/* to do
	1) players click
		a) show current players name
		b) prompt to add players name
		c) AI for computer
*/

// elements
const startGameButton = document.querySelector('#start_game');
const gameSpots = Array.from(document.querySelectorAll('.board-spot'));
const playAgainButton = document.querySelector('#play_again');


// Module for gameboard display (will want to pass in 'symbol' & 'space');
const game = (() =>  {
	const gameBoard = ['','','','','','','',''];
	const winnerMessageHTML = document.querySelector('#winner-message');

	let gameTurn = 1;
	
	let playerOne = {};
	let playerTwo = {};
	
	function setPlayers (first, second) {
		playerOne = first;
		playerTwo = second;
	}

	function currentPlayer () {
		if (gameTurn % 2 == 0) {
			return playerTwo; 
		} else {
			return playerOne;
		}
	}

	function checkPlaySpot (playerSpace) {
		if (playerSpace.innerHTML.length > 0) {
			return false;
		} else {
			return true;
		}
	}

	function updateDisplay(playerWhoClicked){
		this.innerHTML = playerWhoClicked.symbol;
	}

	function checkWinner () {
		let winner = false
		// win by horizontal
		comparison(0,1,2) ? true : false;
		comparison(3,4,5) ? true : false;
		comparison(6,7,8) ? true : false;

		// win by vertical
		comparison(0,3,6) ? true : false;
		comparison(1,4,7) ? true : false;
		comparison(2,5,8) ? true : false;

		// win by diagonal
		comparison(0,4,8) ? true : false;
		comparison(2,4,6) ? true : false;

		function comparison (a,b,c) {
			if (gameBoard[a] === gameBoard[b] &&
					gameBoard[a] === gameBoard[c] &&
					gameBoard[a] !== '') {
				winner = true;
			}
			return winner;
		}
		return winner;
	}

	function winnerMessage (playerWhoWon) {
		winnerMessageHTML.innerHTML = `${playerWhoWon.name} has won!`;

		// show the play again button
		playAgainButton.classList.toggle('hidden');
	}

	function playerClick (e) {
		const playerSpace = this; // <td> html element clicked
		const playerWhoClicked = currentPlayer();

		if (checkPlaySpot(playerSpace)) {
			// push symbol to array
			gameBoard[playerSpace.getAttribute('data-spot')-1] = playerWhoClicked.symbol;
			
			// update the display
			updateDisplay(playerWhoClicked);
			this.innerHTML = playerWhoClicked.symbol;
			
			// check winner
			checkWinner() ? winnerMessage(playerWhoClicked) : null;
			gameTurn += 1;
		}
	}

	function reset() {
		// reset the game array
		for (i = 0; i < 9; i ++) {
			gameBoard[i] = '';
		}
		
		// clear the HTML
		gameSpots.forEach(spot => spot.innerHTML = '');
		winnerMessageHTML.innerHTML = ``;
		playAgainButton.classList.toggle('hidden');
	}

	return { gameBoard, playerClick, setPlayers, reset };

})();


// factory function for players
const createPlayer = (name, symbol) => {
	const getName = () => name 
	const getSymbol = () => symbol
	
	return { name, symbol };
};


function toggleBoard () {
	const displayBoard = document.querySelector('table');
	const startButton = document.querySelector('#start_game');
	
	displayBoard.classList.toggle('hidden');
	startButton.classList.toggle('hidden');

	game.setPlayers(playerOnePick, playerTwoPick);
}

// Event Listeners
startGameButton.addEventListener('click', toggleBoard);
playAgainButton.addEventListener('click', game.reset);

gameSpots.forEach(spot => spot.addEventListener('click', game.playerClick));


// Default players
const playerOnePick = createPlayer('Margot', "X");
const playerTwoPick = createPlayer('Zeke', 'O');
