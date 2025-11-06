function createPlayer(id){
    let pieces = new Array(9).fill(false);
    function getPieces(){
        return pieces;
    }

    function addPiece(n){
        pieces[n] = true;
    }

    function resetPieces(){
        pieces = new Array(9).fill(false);
    }
        
    /*Tic Tac Toe Board (array indices)

        0 | 1 | 2
        ---+---+---
        3 | 4 | 5
        ---+---+---
        6 | 7 | 8                 */
    function checkWin(){
        return (checkWinHelper(0, 1, 2) || checkWinHelper(3, 4, 5) || checkWinHelper(6, 7, 8) || 
        checkWinHelper(0, 3, 6) || checkWinHelper(1, 4, 7) || checkWinHelper(2, 5, 8) || checkWinHelper(0, 4, 8)
        || checkWinHelper(2, 4, 6));
    }

    function checkWinHelper(num1, num2, num3){
        if (pieces[num1] === true && pieces[num2] === true && pieces[num3] === true){
            return true;
        }
        return false;
    }

    return {
        id,
        getPieces,
        addPiece,
        checkWin,
        resetPieces
    };
}

const gameDisplayer = (function(){

    let savedCloseCallback = undefined;
    document.querySelector(".dialog-btn-close").addEventListener("click", function(){
        document.querySelector("dialog").close();
        if (savedCloseCallback) {
            savedCloseCallback();
            savedCloseCallback = undefined;
        }
    });

    function displayMove(id, icon){
        let tempTile = document.querySelectorAll(".tile")[id];
        console.log("my id is " + id);
        console.log("my icon is " + icon);
        console.log(tempTile);
        tempTile.innerHTML=icon; 
    }

    function resetDisplay(){
        let tempTileList = document.querySelectorAll(".tile");
        for (i = 0; i < tempTileList.length; i++){
            tempTileList[i].innerHTML = "";
        }
    }

    function showWin(player, onCloseCallback){
        savedCloseCallback = onCloseCallback;
        let dialogBox = document.querySelector("dialog");
        let innerDialog = document.querySelector("dialog h1");
        if (player === "draw") {
            innerDialog.innerHTML = `Draw!`;
        } else {
            innerDialog.innerHTML = `${player} Wins!`;
        }

        dialogBox.showModal();
    }

    function displayTurn(turnNumber){
        let scoreCounterElement = document.querySelector(".buttons .turnCounter h1");
        if (turnNumber%2===0){
            scoreCounterElement.innerHTML = `Player 1's turn!`;
        } else{
            scoreCounterElement.innerHTML = `Player 2's turn!`;
        }
    }

    function updateScoreDisplay(scoreTracker){
        document.querySelector(".p1-tabledata").innerHTML = scoreTracker[0];
        document.querySelector(".p2-tabledata").innerHTML = scoreTracker[1];
    }

    return {
       displayMove,
       resetDisplay,
       showWin,
       displayTurn,
       updateScoreDisplay
    }
})();

const p1=createPlayer("joe");
const p2=createPlayer("rick");



const gameBoard = (function(p1, p2, gameDisplayer){
    let turnNumber = 0;
    let gameboardPieces = new Array(9).fill(0);
    let winCondition = false;
    let mostRecentMove = undefined;
    let scoreTracker = [0,0];

    function addPiece(n, value){
        gameboardPieces[n] = value;
    }

    function reset(){
        turnNumber = 0;
        gameboardPieces = new Array(9).fill(0);
        mostRecentMove = undefined;
        p1.resetPieces();
        p2.resetPieces();
        gameDisplayer.resetDisplay();
        gameDisplayer.displayTurn(0);
    }

    function checkWin(){
        if (p1.checkWin()){
            gameDisplayer.showWin("Player 1", reset);
            scoreTracker[0]++;
            
        } else if (p2.checkWin()){
            gameDisplayer.showWin("Player 2", reset);
            scoreTracker[1]++;
            
        } else if (turnNumber === 9){
            gameDisplayer.showWin("draw", reset)
        }
        gameDisplayer.updateScoreDisplay(scoreTracker);
    }

    function makeMove(){
        if (gameboardPieces[mostRecentMove] === 0){
            if (turnNumber % 2 == 0){
                p1.addPiece(mostRecentMove);
                addPiece(mostRecentMove, 1);
                gameDisplayer.displayMove(mostRecentMove, "X");
            } else {
                p2.addPiece(mostRecentMove);
                addPiece(mostRecentMove, 2);
                gameDisplayer.displayMove(mostRecentMove, "O");
            }
            
        } else {
            turnNumber--;
        } 
    }

    function resetScoreButton(){
        let resetScoreElement = document.querySelector(".reset-score");
        resetScoreElement.addEventListener('click', function(){
            scoreTracker = [0,0];
            gameDisplayer.updateScoreDisplay(scoreTracker);
        });
    }

    //create eventListeners, and whenever an event listener is clicked, the variable of most recent is activated
    function createEventListenerTiles(){
        let tileList = document.querySelectorAll(".tile");
        resetScoreButton();

        for (i = 0; i < tileList.length; i++){
            tileList[i].addEventListener("click", function(){
                mostRecentMove = this.classList[0];
                makeMove();
                setTimeout(function (){
                    checkWin();
                },0);
                turnNumber++;
                gameDisplayer.displayTurn(turnNumber);
                
            });
        }
    }

    return {
        createEventListenerTiles
    };
})(p1, p2, gameDisplayer);

gameBoard.createEventListenerTiles();

