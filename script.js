var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [ // the combination of cells that decide the winner
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector('.endgame').style.display = "none"; //hiding the game end popup at the startgame
	origBoard = Array.from(Array(9).keys()); //creating an array of 1-9 individual cells
	
    for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');// removing background color from each cell
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') { // if empty square then play
		turn(square.target.id, huPlayer);
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestPosition(), aiPlayer); // ai plays if game not won
	}
}

function turn(squareId, playerType) {
	origBoard[squareId] = playerType; // marking the square with player type mark O for Human X for AI
	if(playerType === huPlayer || playerType === aiPlayer){
		document.getElementById(squareId).innerText = playerType;
	}
	let gameWon = checkWin(origBoard, playerType) // if game is won by a player then call gameover
	if (gameWon) gameOver(gameWon)
}


function checkWin(board, playerType){
    let plays = board.reduce((a, e, i) => 
        (e === playerType) ? a.concat(i) : a, []); //storing the entries in the cell
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){ //entering every win combination and getting the index and value
        if(win.every(element => plays.indexOf(element) > -1)){ //checking every value in a combination has been satisfied by player
            gameWon = {index: index, playerType: playerType}; //returning the winning combination and the playertype
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.playerType == huPlayer? "blue" : "red"; //coloring the winning combos of cells from both players red or blue
    }
    for(var i = 0; i < cells.length;i++){
        cells[i].removeEventListener("click",turnClick, false); //clicking turned off in every cell when game over
    }

    declareWinner(gameWon.playerType == huPlayer ? "player wins" : "ai wins"); //  message to be sent if game won by any player

}

function emptySquares(){
    let test = origBoard.filter(e => typeof e == "number"); //function to check empty squares
    return test;
}


function bestPosition(){
    return minmax(origBoard, aiPlayer).index; // returning the best position the ai player can play according to minmax algorithm
}

function checkTie(){
    if(emptySquares().length == 0){
       for(var i = 0; i < cells.length;i++){
           cells[i].style.backgroundColor = 'green'; // if the game is tied make all the squares green
           cells[i].removeEventListener('click', turnClick, false);
       }
       declareWinner("Game Tied");
    }
    return false;
}

function declareWinner(whichPlayer){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = whichPlayer; // declare which player has won
}


function minmax(newBoard, playerType) {
	var availSpots = emptySquares(); // finding all available spots to play

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10}; // if human winning then return -10
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10}; // if ai winning then return 10
	} else if (availSpots.length === 0) {
		return {score: 0}; // if tie return 0
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]]; // taking move index as board's empty square's index
		newBoard[availSpots[i]] = playerType; // assigning space to players

		if (playerType == aiPlayer) {
			var result = minmax(newBoard, huPlayer); // checking human possible moves as ai player
			move.score = result.score; // assigning score to winner to dictate play accordingly
		} else {
			var result = minmax(newBoard, aiPlayer); // checking ai's moves
			move.score = result.score; // assigning score to winner to dictate play accordingly
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move); // adding all scores according to indices to an array to play accordingly
	}

	var bestMove;
	if(playerType === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) { 
				bestScore = moves[i].score; 
				bestMove = i; // ai player decides the best moves if the score is bigger than -10000
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i; // ai player decides the best moves if the score is lesser than 10000
			}
		}
	}

	return moves[bestMove]; // returns the value of best move possible in the moves array
}