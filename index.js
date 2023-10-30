const $ = selector => document.querySelector(selector);

// Sets difficulty based on the button chosen for use in later generation
const setDifficulty = (evt) => {
    playArea.difficulty = evt.target.id;
};

//Increments counter the first time a grid button is clicked
const incrementCounter = (evt) => {
    if (evt.target.isClicked == "false"){
        evt.target.isClicked = "true";
    $("#counter").textContent = ('000' + (parseInt($("#counter").textContent) + 1)).slice(-3);
    };
}

//Resets the counter varibable for a new game
const resetCounter = () => {
    $("#counter").textContent = "000";
}

//Starts the time when a new game is selected
const startTimer = () => {
    timerInterval = setInterval(incrementTimer, 1000);
};

//Increments the timer while a new game is running
const incrementTimer = () => {
    $("#timer").textContent = ('000' + (parseInt($("#timer").textContent) + 1)).slice(-3);
};

//Resets the timer for a new game when reset it clicked
const resetTimer = () => {
    $("#timer").textContent = "000";
    clearInterval(timerInterval);
};


//Resets the page to its starting layout to start a new game
const resetPage = () => {
    showButtons();
    $("#board").remove();
};

//Hides buttons associated with choosing difficulty and shows the reset button
const hideDifficultyButtons = () => {
    $("#easy").hidden = true;
    $("#medium").hidden = true;
    $("#hard").hidden = true;
    $("#reset").hidden = false;
};

//Hides the reset button and shows buttons associated with choosing difficulty 
const showButtons = () => {
    $("#easy").hidden = false;
    $("#medium").hidden = false;
    $("#hard").hidden = false;
    $("#reset").hidden = true;
};

// Generates starting values for board
// Starts with a 1D array filled with (-1)s to represent mines
// Then fill the remaining button tiles with 0s
const generateStartBoardValues = () => {
    board = [];
    for (let i = 0; i < $("#playArea").mines; i++) {
        board.push(-1);
    }

    while (board.length < $("#playArea").size * $("#playArea").size) {
        board.push(0)
    }
    return board;
};

// Converts 1D array to 2D based on sidelength of the grid
// loop through board length
// add values to temporary row
// when i is divisible by the length of 1 row, push the row to the sorted array and clear the temp row
// due to 0 based indexing, the first value of the first row will be skipped and the last value of the last row will be undefined
// to fix, set the last value of the last row 
const convertTo2DArray = (board) => {
    let new2Dboard = [];
    let tempRow = [];
    for (let i = 1; i <= board.length + 1; i++) {
        tempRow.push(board[i]);
        if (i != 0 && i % $("#playArea").size == 0) {
            new2Dboard.push(tempRow);
            tempRow = [];
        }
    }
    //Fix 0 based index issue
    new2Dboard[new2Dboard.length - 1][new2Dboard.length - 1] = board[0];
    console.log(...new2Dboard);

    return new2Dboard;
};

/*
Generates a 2D array of values matching the dimensions of the game board to be applied to the buttons
## SORTING
The array is then sorted based on random criteria
For each 2 values being compared, a random number is generated between 0 and 1
0.5 is then subtracted from the random number, creating an effective random range of -0.5 to 0.5
Sort order is then determined based on the built-in compareFn(a,b)
if the random number is postive, sort the first value after the second value (b,a)
if the number is negative, sort the second after the first (a,b)
if the number is 0, maintain the original sort order
*/
const generateRandomBoardValues = () => {
    //Generate Starting Values
    let startBoard = generateStartBoardValues();
    //console.log(...startBoard);

    //Sort to shuffle values
    startBoard.sort(() => Math.random() - 0.5)
    //console.log(...startBoard);

    //Convert to 2D array to create rows and cols
    sorted2Dboard = convertTo2DArray(startBoard);

    //Set number value of tiles adjacent to mines
    let completedBoard = incrementAdjacentMineTiles(sorted2Dboard);

    return completedBoard;
}

//Increment the value of tiles adjacent to mines
const incrementAdjacentMineTiles = (board) => {
    for (let i = 0 ; i < board.length;i++){
        for (let j = 0; j < board[0].length;j++){
            //Non edge-case
            if (board[i][j] == -1 ){
                if (i != 0 && j != 0 && i != board.length-1 && j != board[0].length-1){
                console.log("-".repeat(30));
                console.log("above"," : ",board[i-1][j-1], board[i-1][j], board[i-1][j+1]);
                console.log(i,j,"c  : ",board[i][j-1], board[i][j], board[i][j+1]);
                console.log("below"," : ",board[i+1][j-1], board[i+1][j], board[i+1][j+1]);
                console.log("-".repeat(30));
                
                //top row
                if (board[i-1][j-1] != -1) {
                    board[i-1][j-1] += 1;
                }
                if (board[i-1][j] != -1) {
                    board[i-1][j] += 1;
                }
                if (board[i-1][j+1] != -1) {
                    board[i-1][j+1] += 1;
                }

                //mid row
                if (board[i][j-1] != -1) {
                    board[i][j-1] += 1;
                }
                if (board[i][j+1] != -1) {
                    board[i][j+1] += 1;
                }
                
                //bottom row
                if (board[i+1][j-1] != -1) {
                    board[i+1][j-1] += 1;
                }
                if (board[i+1][j] != -1) {
                    board[i+1][j] += 1;
                }
                if (board[i+1][j+1] != -1) {
                    board[i+1][j+1] += 1;
                }
            }
            //top edge
            else if (i == 0 && j != 0 && i != board.length-1 && j != board[0].length-1){
                //mid row
                if (board[i][j-1] != -1) {
                    board[i][j-1] += 1;
                }
                if (board[i][j+1] != -1) {
                    board[i][j+1] += 1;
                }
                
                //bottom row
                if (board[i+1][j-1] != -1) {
                    board[i+1][j-1] += 1;
                }
                if (board[i+1][j] != -1) {
                    board[i+1][j] += 1;
                }
                if (board[i+1][j+1] != -1) {
                    board[i+1][j+1] += 1;
                }
            }
            //bottom edge
            else if (i != 0 && j != 0 && i == board.length-1 && j != board[0].length-1){
                //top row
                if (board[i-1][j-1] != -1) {
                    board[i-1][j-1] += 1;
                }
                if (board[i-1][j] != -1) {
                    board[i-1][j] += 1;
                }
                if (board[i-1][j+1] != -1) {
                    board[i-1][j+1] += 1;
                }

                //mid row
                if (board[i][j-1] != -1) {
                    board[i][j-1] += 1;
                }
                if (board[i][j+1] != -1) {
                    board[i][j+1] += 1;
                }
            }
            //left edge
            else if (i != 0 && j == 0 && i != board.length-1 && j != board[0].length-1){
                //top row
                if (board[i-1][j] != -1) {
                    board[i-1][j] += 1;
                }
                if (board[i-1][j+1] != -1) {
                    board[i-1][j+1] += 1;
                }

                //mid row
                if (board[i][j+1] != -1) {
                    board[i][j+1] += 1;
                }
                

                //bottom row
                if (board[i+1][j] != -1) {
                    board[i+1][j] += 1;
                }
                if (board[i+1][j+1] != -1) {
                    board[i+1][j+1] += 1;
                }
            }
            //right edge
            else if (i != 0 && j != 0 && i != board.length-1 && j == board[0].length-1){
                //top row
                if (board[i-1][j-1] != -1) {
                    board[i-1][j-1] += 1;
                }
                if (board[i-1][j] != -1) {
                    board[i-1][j] += 1;
                }
    
                //mid row
                if (board[i][j-1] != -1) {
                    board[i][j-1] += 1;
                }
                              
                //bottom row
                if (board[i+1][j-1] != -1) {
                    board[i+1][j-1] += 1;
                }
                
                if (board[i+1][j] != -1) {
                    board[i+1][j] += 1;
                }             
            }
            //top left corner
            else if (i == 0 && j == 0){
                //mid row
                if (board[i][j+1] != -1) {
                    board[i][j+1] += 1;
                }
                
                //bottom row               
                if (board[i+1][j] != -1) {
                    board[i+1][j] += 1;
                }
                if (board[i+1][j+1] != -1) {
                    board[i+1][j+1] += 1;
                }
            }
            //top right corner
            else if (i == 0 && j == board[0].length-1) {
                //mid row
                if (board[i][j-1] != -1) {
                    board[i][j-1] += 1;
                }
                                
                //bottom row
                if (board[i+1][j-1] != -1) {
                    board[i+1][j-1] += 1;
                }
                if (board[i+1][j] != -1) {
                    board[i+1][j] += 1;
                }
            }
            //bottom left corner
            else if (i == board[0].length-1 && j == 0){
                //top row
                if (board[i-1][j-1] != -1) {
                    board[i-1][j-1] += 1;
                }
                if (board[i-1][j] != -1) {
                    board[i-1][j] += 1;
                }
                if (board[i-1][j+1] != -1) {
                    board[i-1][j+1] += 1;
                }

                //mid row
                if (board[i][j+1] != -1) {
                    board[i][j+1] += 1;
                }
            }
            //bottom right corner
            else if (i == board[0].length-1 && j == board[0].length-1){
                //top row
                if (board[i-1][j-1] != -1) {
                    board[i-1][j-1] += 1;
                }
                if (board[i-1][j] != -1) {
                    board[i-1][j] += 1;
                }

                //mid row
                if (board[i][j-1] != -1) {
                    board[i][j-1] += 1;
                }
            }
        }
            
        }
    }
    return board;
};

//Build game elements based on the difficulty chosen
const createBoard = () => {
    //Set variables based on difficulty
    var gridSize;
    var mines;
    var buttonGridWidth;
    if ($("#playArea").difficulty == "easy") {
        gridSize = 9;
        mines = 10;
        buttonGridWidth = "225px"
    }
    else if ($("#playArea").difficulty == "medium") {
        gridSize = 16;
        mines = 40;
        buttonGridWidth = "400px"
    }
    else {
        gridSize = 22;
        mines = 99;
        buttonGridWidth = "1650px"
    }
    $("#playArea").mines = mines;
    $("#playArea").size = gridSize;

    //Generate an area to contain the button grid
    let buttonGrid = document.createElement("div");
    buttonGrid.id = "board";
    buttonGrid.style.padding = "20px";
    buttonGrid.style.margin = "auto"
    buttonGrid.style.width = buttonGridWidth;

    //Generate the values for buttons to be set to
    let buttonValues = generateRandomBoardValues();
    //Generate the button grid and set their values
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            //Set button data
            const currentButton = document.createElement("button");
            currentButton.id = j + "/" + + i
            currentButton.classList = "gridButton";
            currentButton.x = j;
            currentButton.y = i;
            currentButton.textContent = buttonValues[i][j];
            currentButton.isClicked = "false";
            currentButton.addEventListener("click", incrementCounter);
            // currentButton.textContent = "⯀";

            //Style the button
            currentButton.style.backgroundColor = "#CCCCCC";
            //currentButton.style.color = "#CCCCCC";
            currentButton.style.color = "Black";
            currentButton.style.fontFamily = 'Courier New, monospace';
            currentButton.style.width = "25px";
            currentButton.style.height = "25px";

            buttonGrid.appendChild(currentButton);
        }
        // create and append a br element to break the lines.
        buttonGrid.appendChild(document.createElement("br"));
    }
    //Append the game board containing the button grid to the play area div
    $("#playArea").appendChild(buttonGrid);
};

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
    resetButton.addEventListener("click", resetPage);
    resetButton.addEventListener("click", resetCounter);
    resetButton.addEventListener("click", resetTimer);

    //Hide all difficulty buttons when one is picked
    easyButton.addEventListener("click", hideDifficultyButtons);
    mediumButton.addEventListener("click", hideDifficultyButtons);
    hardButton.addEventListener("click", hideDifficultyButtons);

    //Set difficulty value for later generation
    easyButton.addEventListener("click", setDifficulty);
    mediumButton.addEventListener("click", setDifficulty);
    hardButton.addEventListener("click", setDifficulty);

    //Build the game board when a difficulty is chosen
    easyButton.addEventListener("click", createBoard);
    mediumButton.addEventListener("click", createBoard);
    hardButton.addEventListener("click", createBoard);

    //Build the counter and timer elements
    let timer = document.createElement("h3");
    let counter = document.createElement("h3");
    timer.id = "timer";
    counter.id = "counter";
    timer.textContent = "000";
    counter.textContent = "000";
    counter.style.display = "inline";
    timer.style.display = "inline";
    counter.style.color = "red";
    timer.style.color = "red";
    counter.style.backgroundColor = "black";
    timer.style.backgroundColor = "black";
    var timerInterval;

    //Start the timer
    easyButton.addEventListener("click", startTimer);
    mediumButton.addEventListener("click", startTimer);
    hardButton.addEventListener("click", startTimer);

    //Center elements within playarea
    menuArea.style.textAlign = "center";

    //Add the buttons to the play area
    menuArea.appendChild(counter);
    menuArea.appendChild(easyButton);
    menuArea.appendChild(mediumButton);
    menuArea.appendChild(hardButton);
    menuArea.appendChild(resetButton);
    menuArea.appendChild(timer);

    //Add the play and menu areas to the main section of the page
    $("main").appendChild(menuArea)
    $("main").appendChild(playArea);
});