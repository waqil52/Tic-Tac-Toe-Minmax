var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [ //the combination of cell numbers for a player or ai to win
	[1, 4, 7],
    [6, 4, 2],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    [2, 5, 8]
]
const cells = document.querySelectorAll('.cell');
startGame();


function startGame(){
    document.querySelector('.endgame').style.display = "none"; //hiding the game end popup at the startgame
    origBoard = Array.from(Array(9).keys()); //creating an array of 0-9 individual cells

    for(var i = 0; i < cells.length;i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

 function turnClick(square){
    turn(square.target.id, huPlayer);
}
function turn(squareId, playerType){
    origBoard[squareId] = playerType;
    document.getElementById(squareId).innerText = playerType; //player adding his turn in each square
    let gameWon = checkWin(origBoard, playerType);
    if(gameWon){
        gameOver(gameWon);
    }
}

function checkWin(board, playerType){
    let plays = board.reduce((a, e, i) => 
        (e === playerType) ? a.concat(i) : a, []); //storing the entries in the cells
    console.log(plays);
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
        document.getElementById(index).style.backgroundColor =gameWon.playerType == huPlayer? "blue" : "red"; //coloring the winning combos of cells from both players red or blue
    }
    for(var i =0; i < cells.length;i++){
        cells[i].removeEventListener("click",turnClick, false);
    }
}