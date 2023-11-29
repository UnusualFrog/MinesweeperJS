document.addEventListener("DOMContentLoaded", () => {
    // Disable default context menu action on right click
    document.addEventListener('contextmenu', event => event.preventDefault());

    //Build title element and append to page
    let title = document.createElement("h1");
    title.style.textAlign = "center";
    title.textContent = "Welcome to Minesweeper";
    $("main").appendChild(title);

    //Build area for game elements
    let playArea = document.createElement("div");
    playArea.id = "playArea";

    //Build area for menu elements and style it
    let menuArea = document.createElement("div");
    menuArea.id = "menuArea";
    menuArea.style.width = "100%";
    menuArea.style.paddingBottom = "4px";
    menuArea.style.borderBottom = "2px solid grey";

    // //Build buttons for setting difficulty and reseting the game
    let easyButton = new MenuButton("easy");
    let mediumButton = new MenuButton("medium");
    let hardButton = new MenuButton("hard");
    let resetButton = new MenuButton("reset");

    // Reset page gameboard, counter, and timer elements when reset button clicked
    resetButton.pageElement.addEventListener("click", Board.resetPage);
    resetButton.pageElement.addEventListener("click", Board.resetCounter);
    resetButton.pageElement.addEventListener("click", Board.resetTimer);

    // Hide all difficulty buttons when one is picked
    easyButton.pageElement.addEventListener("click", MenuButton.hideMenuButtons);
    mediumButton.pageElement.addEventListener("click", MenuButton.hideMenuButtons);
    hardButton.pageElement.addEventListener("click", MenuButton.hideMenuButtons);

    // Set difficulty value for later generation of game board
    easyButton.pageElement.addEventListener("click", () => {
        playArea.difficulty = "easy";
    });
    mediumButton.pageElement.addEventListener("click", () => {
        playArea.difficulty = "medium";
    });
    hardButton.pageElement.addEventListener("click", () => {
        playArea.difficulty = "hard";
    });

    //Build the gameboard element when a difficulty is chosen and append to the page
    easyButton.pageElement.addEventListener("click", () => {
        let gameBoard = new Board(playArea.difficulty);
        playArea.remainingTiles = gameBoard.remainingTiles;
        playArea.appendChild(gameBoard.pageElement);
    });
    mediumButton.pageElement.addEventListener("click", () => {
        let gameBoard = new Board(playArea.difficulty);
        playArea.remainingTiles = gameBoard.remainingTiles;
        playArea.appendChild(gameBoard.pageElement);
    });
    hardButton.pageElement.addEventListener("click", () => {
        let gameBoard = new Board(playArea.difficulty);
        playArea.remainingTiles = gameBoard.remainingTiles;
        playArea.appendChild(gameBoard.pageElement);
    });


    //Build the timer element and style it
    let timer = document.createElement("h3");
    timer.id = "timer";
    timer.textContent = "000";
    timer.style.display = "inline";
    timer.style.color = "red";
    timer.style.backgroundColor = "black";

    //Build the counter element and style it
    let counter = document.createElement("h3");
    counter.id = "counter";
    counter.textContent = "000";
    counter.style.display = "inline";
    counter.style.color = "red";
    counter.style.backgroundColor = "black";

    //Build the game result element
    let gameResult = document.createElement("h4");
    gameResult.id = "gameResult";

    //Start the timer when the game starts
    easyButton.pageElement.addEventListener("click", Board.startTimer);
    mediumButton.pageElement.addEventListener("click", Board.startTimer);
    hardButton.pageElement.addEventListener("click", Board.startTimer);

    //Center elements within playarea container
    menuArea.style.textAlign = "center";

    //Add the menu elements to the play area
    menuArea.appendChild(counter);
    menuArea.appendChild(easyButton.pageElement);
    menuArea.appendChild(mediumButton.pageElement);
    menuArea.appendChild(hardButton.pageElement);
    menuArea.appendChild(resetButton.pageElement);
    menuArea.appendChild(timer);
    menuArea.appendChild(gameResult);

    //Append game areas to the page
    $("main").appendChild(menuArea);
    $("main").appendChild(playArea);

});