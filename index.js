document.addEventListener("DOMContentLoaded", () => {
    //Build title
    let title = document.createElement("h1");
    title.style.textAlign = "center"
    title.textContent = "Welcome to Minesweeper"
    $("main").appendChild(title);

    //Build area for game elements
    let playArea = document.createElement("div");
    playArea.id = "playArea";

    //Build area for menu elements
    let menuArea = document.createElement("div");
    menuArea.id = "menuArea";
    menuArea.style.width = "100%"
    menuArea.style.paddingBottom = "4px";
    menuArea.style.borderBottom = "2px solid grey";

    //Build buttons for setting difficulty and reseting the game
    let easyButton = document.createElement("button");
    let mediumButton = document.createElement("button");
    let hardButton = document.createElement("button");
    let resetButton = document.createElement("button");

    easyButton.textContent = "Beginner";
    mediumButton.textContent = "Intermediate";
    hardButton.textContent = "Expert";
    resetButton.textContent = "Reset";

    easyButton.id = "easy";
    mediumButton.id = "medium";
    hardButton.id = "hard";
    resetButton.id = "reset";

    //Set to menu to differentitate from buttonGrid buttons
    easyButton.classList = "menu";
    mediumButton.classList = "menu";
    hardButton.classList = "menu";
    resetButton.classList = "menu";

    //Hide the reset button until a difficulty is chosen
    resetButton.hidden = true;
    // resetButton.addEventListener("click", resetPage);
    // resetButton.addEventListener("click", resetCounter);
    // resetButton.addEventListener("click", resetTimer);

    //Hide all difficulty buttons when one is picked
    // easyButton.addEventListener("click", hideMenuButtons);
    // mediumButton.addEventListener("click", hideMenuButtons);
    // hardButton.addEventListener("click", hideMenuButtons);

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
    // easyButton.addEventListener("click", startTimer);
    // mediumButton.addEventListener("click", startTimer);
    // hardButton.addEventListener("click", startTimer);

    //Center elements within playarea
    menuArea.style.textAlign = "center";

    gameBoard = new Board("medium");
    playArea.appendChild(gameBoard.pageElement);

    //Add the menu elements to the play area
    menuArea.appendChild(counter);
    menuArea.appendChild(easyButton);
    menuArea.appendChild(mediumButton);
    menuArea.appendChild(hardButton);
    menuArea.appendChild(resetButton);
    menuArea.appendChild(timer);
    menuArea.appendChild(gameResult);
    var buttonValues;

    $("main").appendChild(menuArea);
    $("main").appendChild(playArea);
    
});