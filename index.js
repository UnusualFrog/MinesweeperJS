document.addEventListener("DOMContentLoaded", () => {
    //Build title
    let title = document.createElement("h1");
    title.style.textAlign = "center"
    title.textContent = "Welcome to Minesweeper"
    $("main").appendChild(title);

    //Build area for game elements
    let playArea = document.createElement("div");
    playArea.id = "playArea";

    gameBoard = new Board("easy");
    playArea.appendChild(gameBoard.pageElement);

    //Build area for menu elements
    let menuArea = document.createElement("div");
    menuArea.id = "menuArea";
    menuArea.style.width = "100%"
    menuArea.style.paddingBottom = "4px";
    menuArea.style.borderBottom = "2px solid grey";

    // //Build buttons for setting difficulty and reseting the game
    let easyButton = new menuButton("easy");
    let mediumButton =  new menuButton("medium");
    let hardButton =    new menuButton("hard");
    let resetButton =   new menuButton("reset");

    // Hide the reset button until a difficulty is chosen
    resetButton.pageElement.addEventListener("click", gameBoard.resetPage);
    resetButton.pageElement.addEventListener("click", gameBoard.resetCounter);
    resetButton.pageElement.addEventListener("click", gameBoard.resetTimer);

    // Hide all difficulty buttons when one is picked
    easyButton.pageElement.addEventListener("click", easyButton.hideMenuButtons);
    mediumButton.pageElement.addEventListener("click", mediumButton.hideMenuButtons);
    hardButton.pageElement.addEventListener("click", hardButton.hideMenuButtons);

    //Set difficulty value for later generation
    // easyButton.addEventListener("click", setDifficulty);
    // mediumButton.addEventListener("click", setDifficulty);
    // hardButton.addEventListener("click", setDifficulty);

    //Build the game board when a difficulty is chosen
    // easyButton.addEventListener("click", createBoard);
    // mediumButton.addEventListener("click", createBoard);
    // hardButton.addEventListener("click", createBoard);

    //Build the timer element
    let timer = document.createElement("h3");
    timer.id = "timer";
    timer.textContent = "000";
    timer.style.display = "inline";
    timer.style.color = "red";
    timer.style.backgroundColor = "black";
    var timerInterval;

    //Build the counter element
    let counter = document.createElement("h3");
    counter.id = "counter";
    counter.textContent = "000";
    counter.style.display = "inline";
    counter.style.color = "red";
    counter.style.backgroundColor = "black";

    //Build the game result element
    let gameResult = document.createElement("h4");
    gameResult.id = "gameResult";

    //Start the timer
    easyButton.pageElement.addEventListener("click", gameBoard.startTimer);
    mediumButton.pageElement.addEventListener("click", gameBoard.startTimer);
    hardButton.pageElement.addEventListener("click", gameBoard.startTimer);

    //Center elements within playarea
    menuArea.style.textAlign = "center";

    //Add the menu elements to the play area
    menuArea.appendChild(counter);
    menuArea.appendChild(easyButton.pageElement);
    menuArea.appendChild(mediumButton.pageElement);
    menuArea.appendChild(hardButton.pageElement);
    menuArea.appendChild(resetButton.pageElement);
    menuArea.appendChild(timer);
    menuArea.appendChild(gameResult);
    var buttonValues;

    $("main").appendChild(menuArea);
    $("main").appendChild(playArea);

});