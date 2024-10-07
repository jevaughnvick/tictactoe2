let gameWon = {
    won: false,
    sign: null
};

const app = (function(){

    const gameboard = {

        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
    };

    const players = [];

    function initializePlayerOne(e){

        e.preventDefault();
    
        let playerOneName = uiController.nameInput.value;
        uiController.playerName.textContent = uiController.nameInput.value;
        let playerOneSign;
    
        uiController.radioButtons.x.checked ? playerOneSign = "X" : playerOneSign = "O";
    
        if(playerOneName === "" || uiController.radioButtons.x.checked === false && uiController.radioButtons.o.checked === false){
            alert("Please complete the form.");
        }else{
            players.push({
                name: playerOneName,
                sign: playerOneSign
            }, {
                name: "Computer",
                sign: playerOneSign === "X" ? "O" : "X"
            })
            uiController.toggleForm();
        }
    }

    const makePlay = (e) => {

        const position = e.target.dataset.position;
        const sign = players[0].sign;
        for(let prop in gameboard){
            if(prop == position) gameboard[prop] = sign;
        }
        checkWin();
    }

    const makeCompPlay = () => {

        if(gameWon.won) return;
        const emptyCells = getEmptyCells();
        if(emptyCells < 2) return;
        const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const position = randomEmptyCell.dataset.position;
        const sign = players[1].sign;
        for(let prop in gameboard){
            if(prop == position) gameboard[prop] = sign;
        }
        checkWin();
    };

    function getEmptyCells(){

        return [...document.querySelectorAll(".cell")].filter(cell => cell.textContent === "");
    }

    function checkWin(){
        
        const winMoves = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
        
        outerLoop:
        for(let array of winMoves){

            let sign = null;
            let nextSign = null;

            innerLoop:
            for(let cell of array){

                if(sign === null){

                    sign = gameboard[cell];
                }else{

                    if(nextSign === null){

                        if(gameboard[cell] === sign){

                            nextSign = gameboard[cell];
                        }else{

                            continue outerLoop;
                        }
                    }else{

                        if(gameboard[cell] === nextSign){

                            gameWon.won = true;
                            gameWon.sign = gameboard[cell];
                            return;
                        }else{

                            continue outerLoop;
                        }
                    }
                }
            }
        }
    }

    function restartGame(e){

        e.preventDefault();
        if(gameWon.won) uiController.togglePlayAgainForm();
        if(gameWon.won) uiController.toggleShadow();
        uiController.toggleRestartBtn();
        clearGameboard();
        gameWon.won = false;
        gameWon.sign = null;
    }

    function endGame(e){

        e.preventDefault();
        uiController.togglePlayAgainForm();
        uiController.toggleShadow();
        gameboard[4] = "B";
        gameboard[5] = "Y";
        gameboard[6] = "E";
        updateScreen.showPlays();
        uiController.toggleRestartBtn();
    }

    function clearGameboard(){

        for(let prop in gameboard){

            gameboard[prop] = null;
        }
        updateScreen.showPlays();
    }

    return { gameboard, makePlay, makeCompPlay, initializePlayerOne, restartGame, endGame, players };
})();



const uiController = (function(){

    const playForm = document.querySelector("#play-form");
    const playAgainForm = document.querySelector("#play-again-form");
    const playAgainYes = document.querySelector("#yes-play-again");
    const playAgainNo = document.querySelector("#no-play-again");
    const restartBtn = document.querySelector("#restart");
    const shadow = document.querySelector("#shadow");
    const playBtn = document.querySelector("input[value=Play]");
    const gridContainer = document.querySelector("#grid-container");
    const cells = document.querySelectorAll(".cell");
    const nameInput = document.querySelector("#name");
    const playerName = document.querySelector("#player-name");
    const message = document.querySelector("#message");
    const radioButtons = {
        x: document.querySelector("#x"),
        o: document.querySelector("#o")
    };

    document.addEventListener("DOMContentLoaded", toggleForm);
    document.addEventListener("DOMContentLoaded", () => nameInput.focus());
    restartBtn.addEventListener("click", app.restartGame);
    playBtn.addEventListener("click", e => {

        app.initializePlayerOne(e);
    });

    playAgainYes.addEventListener("click", app.restartGame);
    playAgainNo.addEventListener("click", app.endGame);

    function toggleForm(){

        playForm.classList.toggle("hidden");
        gridContainer.classList.toggle("hidden");
        shadow.classList.toggle("hidden");
    }

    function togglePlayAgainForm(){

        playAgainForm.classList.toggle("hidden");
    }

    function toggleShadow(){

        shadow.classList.toggle("hidden");
    }

    function toggleRestartBtn(){

        restartBtn.classList.toggle("hidden");
    }

    cells.forEach(cell => cell.addEventListener("click", e => {

        const emptyCells = getEmptyCells();

        if(cell.textContent === ""){
            app.makePlay(e);
            updateScreen.showPlays();
            app.makeCompPlay();
            updateScreen.showPlays();
            updateScreen.displayWinner(gameWon.sign);
            if(emptyCells.length === 9) toggleRestartBtn();
            
        }

        function getEmptyCells(){



            return [...cells].filter(cell => cell.textContent === "");
        }
    }))

    return { cells, nameInput, radioButtons, toggleForm, toggleShadow, togglePlayAgainForm, playerName, message, toggleRestartBtn };
})();




const updateScreen = (() => {

    const showPlays = (play) => {

        clearGrid();
        for(let prop in app.gameboard){

            for(let cell of uiController.cells){
                
                if(prop == cell.dataset.position) cell.textContent = app.gameboard[prop];
                
            }
        }
    };

    const clearGrid = () => {

        for(let cell of uiController.cells){
                
            cell.textContent = "";
        }
    };

    const displayWinner = (sign) => {

        if(!gameWon.won) return;
        uiController.toggleShadow();
        uiController.togglePlayAgainForm();
        sign === app.players[0].sign ? uiController.message.textContent = "You Won" : uiController.message.textContent = "You Lost";
    };

    return { showPlays, displayWinner };
})();

