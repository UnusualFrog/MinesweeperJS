const $ = selector => document.querySelector(selector);

// Sets difficulty based on the button chosen for use in later generation
const setDifficulty = (evt) => {
    playArea.difficulty = evt.target.id;
};

//Resets the page to its starting layout to start a new game
const resetPage = () => {
    showMenuButtons();
    $("#board").remove();
    gameResult.textContent = "";
};

//Hides buttons associated with choosing difficulty and shows the reset button
const hideMenuButtons = () => {
    $("#easy").hidden = true;
    $("#medium").hidden = true;
    $("#hard").hidden = true;
    $("#reset").hidden = false;
};

//Hides the reset button and shows buttons associated with choosing difficulty 
const showMenuButtons = () => {
    $("#easy").hidden = false;
    $("#medium").hidden = false;
    $("#hard").hidden = false;
    $("#reset").hidden = true;
};

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

//Increments counter the first time a grid button is clicked
const incrementClickCounter = () => {
    $("#counter").textContent = ('000' + (parseInt($("#counter").textContent) + 1)).slice(-3);
}

//Resets the counter varibable for a new game
const resetCounter = () => {
    $("#counter").textContent = "000";
}

const triggerLoss = (evt) => {
    if (evt.target.actualValue == -1){
        $("#gameResult").textContent = "You Lose!";
        $("#gameResult").style.color = "red";
        $("#board").disabled = "disabled";
        clearInterval(timerInterval);
    }
};

const revealClickedTile = (evt) => {
    if (evt.target.isClicked == "false"){
        evt.target.isClicked = "true";
        evt.target.textContent = evt.target.actualValue;
        evt.target.style.color = determineTileColor(evt.target.actualValue);
        incrementClickCounter();
    };
};

const determineTileColor = (tileValue) => {
    if (tileValue == "-1"){
        return "orange";
    }
    else if (tileValue == "0"){
        return "#CCCCCC";
    }
    else if (tileValue == "1"){
        return "#0100FE";
    }
    else if (tileValue == "2"){
        return "#008000";
    }
    else if (tileValue == "3"){
        return "#FE0000";
    }
    else if (tileValue == "4"){
        return "#00007F";
    }
    else if (tileValue == "5"){
        return "#800000";
    }
    else if (tileValue == "6"){
        return "#008081";
    }
    else if (tileValue == "7"){
        return "#000000";
    }
    else if (tileValue == "8"){
        return "#808080";
    }
    else {
        return "#FFFFFF";
    }
};

// Generates starting values for board
// Starts with a 1D array filled with (-1)s to represent mines
// Then fill the remaining button tiles with 0s
const generateStartBoardValues = () => {
    board = [];
    for (let i = 0; i < $("#playArea").mines; i++) {
        board.push(-1);
    }

    while (board.length < $("#playArea").sizeX * $("#playArea").sizeY) {
        board.push(0)
    }
    return board;
};

// Converts 1D array to 2D based on length of the grid
// loop through board length
// add values to temporary row
// when i is divisible by the length of 1 row, push the row to the sorted array and clear the temp row
const convertTo2DArray = (board) => {
    let new2Dboard = [];
    let tempRow = [];
    for (let i = 0; i <= board.length-1; i++) {
        tempRow.push(board[i]);
        if (i != 0 && (i+1) % $("#playArea").sizeY == 0) {
            new2Dboard.push(tempRow);
            tempRow = [];
        }
    }
    // console.log(...new2Dboard);

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
    startBoard.sort(() => Math.random() - 0.5);
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
                // console.log("-".repeat(30));
                // console.log("above"," : ",board[i-1][j-1], board[i-1][j], board[i-1][j+1]);
                // console.log(i,j,"c  : ",board[i][j-1], board[i][j], board[i][j+1]);
                // console.log("below"," : ",board[i+1][j-1], board[i+1][j], board[i+1][j+1]);
                // console.log("-".repeat(30));
                
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

const callRevealAdjacentTiles = (evt) => {
    let currentX = evt.target.x;
    let currentY = evt.target.y;
    revealAdjacentTiles(currentX, currentY);
};

//Recursively reaveal adjacent 0 tiles
const revealAdjacentTiles = (currentX, currentY) => {
    // console.log("---");
    // console.log(currentX, currentY);
    // console.log(buttonValues[currentX][currentY]);
    
    while (buttonValues[currentX][currentY] == 0 ){
        document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").style.color = "#CCCCCC";
        document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").isClicked = "true";
        //Check Bottom
        if (currentX != buttonValues.length-1){
            if (buttonValues[currentX+1][currentY] == 0){
                revealAdjacentTiles(currentX+1, currentY);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
                // console.log(document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]"));
                
                if (document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]").actualValue));
                }
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        //Check Top
        if (currentX != 0){
            if (buttonValues[currentX-1][currentY] == 0){
                revealAdjacentTiles(currentX-1, currentY);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
                if (document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY}`) + "]").actualValue));
                }
                
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        //Check Left
        if (currentY != 0){
            if (buttonValues[currentX][currentY-1] == 0){
                revealAdjacentTiles(currentX, currentY-1);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";

                if (document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY-1}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY-1}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY-1}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY-1}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY-1}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY-1}`) + "]").actualValue));
                }
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        //Check Right
        if (currentY != buttonValues[0].length-1){
            if (buttonValues[currentX][currentY+1] == 0){
                revealAdjacentTiles(currentX, currentY+1);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";

                if (document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY+1}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY+1}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY+1}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY+1}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY+1}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY+1}`) + "]").actualValue));
                }
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        //Check Top Left
        if (currentX != 0 & currentY != 0){
            if (buttonValues[currentX-1][currentY-1] == 0){
                revealAdjacentTiles(currentX-1, currentY-1);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
                if (document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY-1}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY-1}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY-1}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY-1}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY-1}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY-1}`) + "]").actualValue));
                }
                
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        //Check Top Right
        if (currentX != 0 & currentY != buttonValues[0].length-1){
            if (buttonValues[currentX-1][currentY+1] == 0){
                revealAdjacentTiles(currentX-1, currentY+1);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
                if (document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY+1}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY+1}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY+1}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY+1}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY+1}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY+1}`) + "]").actualValue));
                }
                
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        //Check Bottom Left
        if (currentX != buttonValues.length-1 & currentY != 0){
            if (buttonValues[currentX+1][currentY-1] == 0){
                revealAdjacentTiles(currentX+1, currentY-1);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
                if (document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY-1}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY-1}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY-1}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY-1}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY-1}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY-1}`) + "]").actualValue));
                }
                
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        //Check Bottom Right
        if (currentX != buttonValues.length-1 & currentY != buttonValues[0].length-1){
            if (buttonValues[currentX+1][currentY+1] == 0){
                revealAdjacentTiles(currentX+1, currentY+1);
            }
            else {
                buttonValues[currentX][currentY] = -2;
                document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
                if (document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY+1}`) + "]").textContent != "0"){
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY+1}`) + "]").textContent = document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY+1}`) + "]").actualValue;
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY+1}`) + "]").isClicked = "true";
                    document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY+1}`) + "]").style.color = determineTileColor((document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY+1}`) + "]").actualValue));
                }
                
            }
        }
        else {
            buttonValues[currentX][currentY] = -2;
            document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]").textContent = "0";
        }

        return
    }
};

//Build game elements based on the difficulty chosen
const createBoard = () => {
    //Set variables based on difficulty
    var gridSizeX;
    var gridSizeY;
    var mines;
    var buttonGridWidth;
    if ($("#playArea").difficulty == "easy") {
        gridSizeX = 9;
        gridSizeY = 9;
        mines = 10;
        buttonGridWidth = "225px"
    }
    else if ($("#playArea").difficulty == "medium") {
        gridSizeX = 16;
        gridSizeY = 16;
        mines = 40;
        buttonGridWidth = "400px"
    }
    else {
        gridSizeX = 20;
        gridSizeY = 24;
        mines = 99;
        buttonGridWidth = "600px"
    }
    $("#playArea").mines = mines;
    $("#playArea").sizeX = gridSizeX;
    $("#playArea").sizeY = gridSizeY;

    //Generate an area to contain the button grid
    let buttonGrid = document.createElement("fieldset");
    buttonGrid.id = "board";
    buttonGrid.style.padding = "20px";
    buttonGrid.style.margin = "auto";
    buttonGrid.style.width = buttonGridWidth;

    //Generate the values for buttons to be set to
    buttonValues = generateRandomBoardValues();
    //Generate the button grid and set their values
    for (let i = 0; i < $("#playArea").sizeX; i++) {
        for (let j = 0; j < $("#playArea").sizeY; j++) {
            //Set button data
            const currentButton = document.createElement("button");
            currentButton.id = i + "/" + j;
            currentButton.classList = "gridButton";
            currentButton.x = i;
            currentButton.y = j;
            currentButton.textContent = "?";
            // currentButton.textContent = buttonValues[i][j];
            currentButton.actualValue = buttonValues[i][j];
            currentButton.isClicked = "false";
            currentButton.addEventListener("click", revealClickedTile);
            currentButton.addEventListener("click", callRevealAdjacentTiles);
            currentButton.addEventListener("click", triggerLoss);

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
    easyButton.addEventListener("click", hideMenuButtons);
    mediumButton.addEventListener("click", hideMenuButtons);
    hardButton.addEventListener("click", hideMenuButtons);

    //Set difficulty value for later generation
    easyButton.addEventListener("click", setDifficulty);
    mediumButton.addEventListener("click", setDifficulty);
    hardButton.addEventListener("click", setDifficulty);

    //Build the game board when a difficulty is chosen
    easyButton.addEventListener("click", createBoard);
    mediumButton.addEventListener("click", createBoard);
    hardButton.addEventListener("click", createBoard);

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
    easyButton.addEventListener("click", startTimer);
    mediumButton.addEventListener("click", startTimer);
    hardButton.addEventListener("click", startTimer);

    //Center elements within playarea
    menuArea.style.textAlign = "center";

    //Add the menu elements to the play area
    menuArea.appendChild(counter);
    menuArea.appendChild(easyButton);
    menuArea.appendChild(mediumButton);
    menuArea.appendChild(hardButton);
    menuArea.appendChild(resetButton);
    menuArea.appendChild(timer);
    menuArea.appendChild(gameResult);
    var buttonValues;

    //Add the play and menu areas to the main section of the page
    $("main").appendChild(menuArea)
    $("main").appendChild(playArea);
});