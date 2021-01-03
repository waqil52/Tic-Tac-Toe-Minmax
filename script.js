var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [ //the combination of cell numbers for a player or ai to win
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
    
}