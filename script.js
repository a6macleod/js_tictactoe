
// elements
const gameSpots = Array.from(document.querySelectorAll('.board-spot'));
const playAgainButton = document.querySelector('#play_again');
const currentPlayerDisplay = document.querySelector('#current_player');
const onePlayerGameButton = document.querySelector('#one_player_game_button');
const twoPlayerGameButton = document.querySelector('#two_player_game_button');


// Module for gameboard display;
const game = (() =>  {
	let gameBoard = ['','','','','','','','',''];
	const displayBoard = document.querySelector('table');
	const gameOverMessageHTML = document.querySelector('#winner-message');
	const playerOneScoreDisplay = document.querySelector('#player_one_score');
	const playerTwoScoreDisplay = document.querySelector('#player_two_score');

	let gameTurn = 1;
	let onePlayerGame = false;

	let playerOneScore = 0;
	let playerTwoScore = 0;
	
	let playerOne = {};
	let playerTwo = {};

	let gameOver = false;


	// Computer player AI logic
	function checkIfComputerTurn() {
		if (playerOne.computer && currentPlayer() == playerOne) {
			checkComputerChoice();
		}
	}

	function checkComputerChoice () {
		const arraySpot = generateComputerNumber();

		if (isBoardFull()) {
			return
		} else if (checkPlaySpot(arraySpot)) {
			const gameBoardDisplay = document.querySelector(`td[data-spot="${arraySpot}"]`);

			clickHandling(gameBoardDisplay, arraySpot);

		} else {
			checkComputerChoice();
		}
	}

	function generateComputerNumber () {
		let computerChoice = (Math.floor(Math.random()*9));
		console.log(computerChoice);
		return computerChoice;
	}


	// is game a tie
	function isBoardFull(){
		if (!gameBoard.includes('')) {
			console.log(`!gameBoard.includes('')${!gameBoard.includes('')}`);
			gameOver = true;
			tieGameMessage();
		}
	}

	// Winner logic
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
		gameOver = true;

		gameOverMessageHTML.innerHTML = `${playerWhoWon.name} has won!`;

		// show the play again button
		toggleHiddenClass(playAgainButton);

		// hide current player turn
		toggleHiddenClass(currentPlayerDisplay);

		// update score and display
		playerOne == playerWhoWon ? playerOneScore += 1 : playerTwoScore += 1;
		showGameScore();
		
	}

	function tieGameMessage () {
		gameOver = true;

		gameOverMessageHTML.innerHTML = `It's a Tie!`;

		// show the play again button
		toggleHiddenClass(playAgainButton);

		// hide current player turn
		toggleHiddenClass(currentPlayerDisplay);

		showGameScore();
	}


	// game flow
	function currentPlayer () {
		if (gameTurn % 2 == 0) {
			return playerTwo; 
		} else {
			return playerOne;
		}
	}

	function checkPlaySpot (arraySpot) {
		// passes in the position of the array (HTML attribute data-spot[0-9])

		if (gameBoard[arraySpot] == '') {
			return true;
		} else {
			return false;
		}
	}

	function playerClick (e) {
		if (gameOver == true) {
			return
		} else {
			
			const gameBoardDisplay = this;
			const arraySpot = this.getAttribute(`data-spot`);
			
			if (checkPlaySpot(arraySpot)) {	
				clickHandling(gameBoardDisplay, arraySpot);
			}
		}
	}

	function clickHandling (gameBoardDisplay, arraySpot) {
		const playerWhoClicked = currentPlayer();

		// push player symbol to array
		gameBoard[arraySpot] = playerWhoClicked.symbol;
		
		// update the game display
		updateDisplay(playerWhoClicked);
		gameBoardDisplay.innerHTML = playerWhoClicked.symbol;

		isGameOver(playerWhoClicked);
	}

	function isGameOver(playerWhoClicked) {
		if (checkWinner()) {
			
			winnerMessage(playerWhoClicked);
		
		} else if (isBoardFull()) {
			
			return // board is full game was a tie
		
		} else {
			nextTurn();
		}
	}

	function nextTurn() {
		gameTurn += 1;
		showCurrentPlayer();
	}


	// HTML Game information
	function updateDisplay(playerWhoClicked){
		this.innerHTML = playerWhoClicked.symbol;
	}

	function toggleHiddenClass(element) {
		element.classList.toggle('hidden');
	}

	function showCurrentPlayer () {
		thePlayer = currentPlayer();
		currentPlayerDisplay.innerHTML = `${thePlayer.name}'s Turn!`;

		onePlayerGame ? checkIfComputerTurn() : null; 
	}

	function showGameScore () {
		playerOneScoreDisplay.innerHTML = `${playerOne.name} (${playerOne.symbol}): ${playerOneScore}`
		playerTwoScoreDisplay.innerHTML = `${playerTwo.name} (${playerTwo.symbol}): ${playerTwoScore}`
	}

	function reset() {
		gameOver = false;

		// reset the game array
		for (let i = 0; i < 9; i++) {
			gameBoard[i] = '';
		}

			// clear the HTML game board
			gameSpots.forEach(spot => spot.innerHTML = '');
			gameOverMessageHTML.innerHTML = ``;
			toggleHiddenClass(playAgainButton);
			toggleHiddenClass(currentPlayerDisplay);

			nextTurn();
		}

	// Start Game 
	function setPlayers (first, second) {
		playerOne = first;
		playerTwo = second;

		playerOne.computer ? onePlayerGame = true : null; // checks if a player is computer

		startGame();
	}

	function startGame () {
		// hide buttons & show game
		toggleHiddenClass(onePlayerGameButton);
		toggleHiddenClass(twoPlayerGameButton);
		toggleHiddenClass(displayBoard);
		toggleHiddenClass(currentPlayerDisplay);

		showGameScore();

		showCurrentPlayer();
	}

	return { playerClick, setPlayers, reset };

})();


// factory function for players
const createPlayer = (name, symbol, computer=false) => {
	const getName = () => name 
	const getSymbol = () => symbol
	const isComputer = () => computer
	
	return { name, symbol, computer };
};

function startOnePlayerGame (){
	// computer AI
	const playerOnePick = createPlayer('Hal-2000', 'X', true);// computer player
	const playerTwoPick = createPlayer('Zeke', 'O');

	// starts the game
	game.setPlayers(playerOnePick, playerTwoPick);
}

function startTwoPlayerGame () {
	// Default players
	const playerOnePick = createPlayer('Margot', 'X');
	const playerTwoPick = createPlayer('Zeke', 'O');
	
	// starts the game
	game.setPlayers(playerOnePick, playerTwoPick);
}

// Event Listeners
playAgainButton.addEventListener('click', game.reset);
onePlayerGameButton.addEventListener('click', startOnePlayerGame);
twoPlayerGameButton.addEventListener('click', startTwoPlayerGame);

gameSpots.forEach(spot => spot.addEventListener('click', game.playerClick));

