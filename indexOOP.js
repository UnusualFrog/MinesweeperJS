const $ = selector => document.querySelector(selector);

class Tile {
    value;
    x;
    y;
    pageElement;
    constructor(value, x, y){
        this.value = value;
        this.x = x;
        this.y = y;
    }

    getValue(){
        return this.value;
    }

    setValue(newValue){
        this.value = newValue;
    }

    getX(){
        return this.x;
    }
    setX(newX){
        this.x = newX;
    }

    getY(){
        return this.y;
    }

    setY(newY){
        this.y = newY;
    }
    
    buildPageElement(){
        const currentButton = document.createElement("button");
        currentButton.id = this.x + "/" + this.y;
        currentButton.classList = "gridButton";
        currentButton.x = this.x;
        currentButton.y = this.y;
        // currentButton.textContent = "?";
        currentButton.isClicked = "false";

        // currentButton.addEventListener("click", this.revealClickedTile);
        
        // currentButton.addEventListener("click", triggerLoss);

        // Style the button
        currentButton.style.backgroundColor = "#CCCCCC";
        //currentButton.style.color = "#CCCCCC";
        currentButton.style.color = "Black";
        currentButton.style.fontFamily = 'Courier New, monospace';
        currentButton.style.width = "25px";
        currentButton.style.height = "25px";
        this.pageElement = currentButton;
    }
    
    revealClickedTile = (evt) => {
        if (evt.target.isClicked == "false"){
            evt.target.isClicked = "true";
            evt.target.textContent = evt.target.actualValue;
            evt.target.style.color = this.determineTileColor(evt.target.actualValue);
            this.incrementClickCounter();
        };
    };

    determineTileColor = (tileValue) => {
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

    //Increments counter the first time a grid button is clicked
    incrementClickCounter = () => {
        $("#counter").textContent = ('000' + (parseInt($("#counter").textContent) + 1)).slice(-3);
    }
}

class Board {
        difficulty;
        gridSizeX;
        gridSizeY;
        mineCount;
        buttonGridWidth;
        boardGrid = [];
        pageElement; 

    constructor(difficulty){
        this.difficulty = difficulty;
        this.setDifficultyValues(difficulty);
        this.generateStartBoardValues();
        this.shuffleBoard();
        this.convertTo2DArray();
        this.incrementAdjacentMineTiles();
        console.log(this.boardGrid);
        // let str = ""
        // for (let i = 0; i < this.boardGrid.length;i++){
        //     for (let j = 0; j < this.boardGrid[0].length;j++){
        //         str += this.boardGrid[i][j].getValue();
                
        //     }
        //     console.log(str)
        //     str = ""
        // }
        this.buildPageElement();
    }

    // Set values dependant on difficulty
    setDifficultyValues(currentDifficulty){
        if (currentDifficulty == "easy") {
            this.gridSizeX = 9;
            this.gridSizeY = 9;
            this.mineCount = 10;
            this.buttonGridWidth = "225px"
        }
        else if (currentDifficulty == "medium") {
            this.gridSizeX = 16;
            this.gridSizeY = 16;
            this.mineCount = 40;
            this.buttonGridWidth = "400px"
        }
        else {
            this.gridSizeX = 20;
            this.gridSizeY = 24;
            this.mineCount = 99;
            this.buttonGridWidth = "600px"
        }
    };

    // Build the actual DOM element to be appended to the page
    buildPageElement(){
        let buttonGrid = document.createElement("fieldset");
        buttonGrid.id = "board";
        buttonGrid.style.padding = "20px";
        buttonGrid.style.margin = "auto";
        buttonGrid.style.width = this.buttonGridWidth;
        for (let i = 0; i < this.gridSizeX; i++) {
            for (let j = 0; j < this.gridSizeY; j++) {
                //Set button data
                this.boardGrid[i][j].buildPageElement();
                const currentButton = this.boardGrid[i][j].pageElement;
                currentButton.textContent = this.boardGrid[currentButton.x][currentButton.y].getValue();
                currentButton.actualValue = this.boardGrid[i][j].getValue();
                
                currentButton.addEventListener("click", this.callRevealAdjacentTiles);

                buttonGrid.appendChild(currentButton);
            }
            // create and append a br element to break the lines.
            buttonGrid.appendChild(document.createElement("br"));
        }
        this.pageElement = buttonGrid;
    };

    // Generates starting values for board
    // Starts with a 1D array filled with (-1)s to represent mines
    // Then fill the remaining button tiles with 0s
     generateStartBoardValues(){
        for (let i = 0; i < this.mineCount; i++) {
            this.boardGrid.push(new Tile(-1));
        }

        while (this.boardGrid.length < this.gridSizeX * this.gridSizeY) {
            this.boardGrid.push(new Tile(0))
        }
    };

    /*
    Generates a 2D array of values matching the dimensions of the game board to be applied to the buttons
    ## SORTING
    The array is then sorted based on random criteria
    For each 2 values being compared, a random number is generated between 0 and 1
    0.5 is then subtracted from the random number, creating an effective random range of -0.5 to 0.5
    Sort order is then determined based on the built-in compareFn(a,b) from the .sort's logic
    if the random number is postive, sort the first value after the second value (b,a)
    if the number is negative, sort the second after the first (a,b)
    if the number is 0, maintain the original sort order
    */
    shuffleBoard(){
        this.boardGrid.sort(() => Math.random() - 0.5);
    }

    // Converts 1D array to 2D based on length of the grid
    // loop through board length
    // add values to temporary row
    // when i is divisible by the length of 1 row, push the row to the sorted array and clear the temp row
     convertTo2DArray(){
        let new2Dboard = [];
        let tempRow = [];
        for (let i = 0; i <= this.boardGrid.length-1; i++) {
            this.boardGrid[i].setX(new2Dboard.length);
            this.boardGrid[i].setY(tempRow.length);
            tempRow.push(this.boardGrid[i]);
            
            if (i != 0 && (i+1) % this.gridSizeY == 0) {
                new2Dboard.push(tempRow);
                tempRow = [];
            }
        }
        this.boardGrid = new2Dboard;
    };

    //Increment the value of tiles adjacent to mines
    incrementAdjacentMineTiles(){
        for (let i = 0 ; i < this.boardGrid.length;i++){
            for (let j = 0; j < this.boardGrid[0].length;j++){
                //Non edge-case
                if (this.boardGrid[i][j].getValue() == -1 ){
                    if (i != 0 && j != 0 && i != this.boardGrid.length-1 && j != this.boardGrid[0].length-1){
                    // console.log("-".repeat(30));
                    // console.log("above"," : ",this.boardGrid[i-1][j-1], this.boardGrid[i-1][j], this.boardGrid[i-1][j+1]);
                    // console.log(i,j,"c  : ",this.boardGrid[i][j-1], this.boardGrid[i][j], this.boardGrid[i][j+1]);
                    // console.log("below"," : ",this.boardGrid[i+1][j-1], this.boardGrid[i+1][j], this.boardGrid[i+1][j+1]);
                    // console.log("-".repeat(30));
                    
                    //top row
                    if (this.boardGrid[i-1][j-1].getValue() != -1) {
                        this.boardGrid[i-1][j-1].setValue(this.boardGrid[i-1][j-1].getValue() + 1);
                    }
                    if (this.boardGrid[i-1][j].getValue() != -1) {
                        this.boardGrid[i-1][j].setValue(this.boardGrid[i-1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i-1][j+1].getValue() != -1) {
                        this.boardGrid[i-1][j+1].setValue(this.boardGrid[i-1][j+1].getValue() + 1);
                    }

                    //mid row
                    if (this.boardGrid[i][j-1].getValue() != -1) {
                        this.boardGrid[i][j-1].setValue(this.boardGrid[i][j-1].getValue() + 1);
                    }
                    if (this.boardGrid[i][j+1].getValue() != -1) {
                        this.boardGrid[i][j+1].setValue(this.boardGrid[i][j+1].getValue() + 1);
                    }
                    
                    //bottom row
                    if (this.boardGrid[i+1][j-1].getValue() != -1) {
                        this.boardGrid[i+1][j-1].setValue(this.boardGrid[i+1][j-1].getValue() + 1);
                    }
                    if (this.boardGrid[i+1][j].getValue() != -1) {
                        this.boardGrid[i+1][j].setValue(this.boardGrid[i+1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i+1][j+1].getValue() != -1) {
                        this.boardGrid[i+1][j+1].setValue(this.boardGrid[i+1][j+1].getValue() + 1);
                    }
                }
                // Top edge
                else if (i == 0 && j != 0 && i != this.boardGrid.length - 1 && j != this.boardGrid[0].length - 1) {
                    // Mid row
                    if (this.boardGrid[i][j - 1].getValue() != -1) {
                        this.boardGrid[i][j - 1].setValue(this.boardGrid[i][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i][j + 1].getValue() != -1) {
                        this.boardGrid[i][j + 1].setValue(this.boardGrid[i][j + 1].getValue() + 1);
                    }

                    // Bottom row
                    if (this.boardGrid[i + 1][j - 1].getValue() != -1) {
                        this.boardGrid[i + 1][j - 1].setValue(this.boardGrid[i + 1][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i + 1][j].getValue() != -1) {
                        this.boardGrid[i + 1][j].setValue(this.boardGrid[i + 1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i + 1][j + 1].getValue() != -1) {
                        this.boardGrid[i + 1][j + 1].setValue(this.boardGrid[i + 1][j + 1].getValue() + 1);
                    }
                }
                // Bottom edge
                else if (i != 0 && j != 0 && i == this.boardGrid.length - 1 && j != this.boardGrid[0].length - 1) {
                    // Top row
                    if (this.boardGrid[i - 1][j - 1].getValue() != -1) {
                        this.boardGrid[i - 1][j - 1].setValue(this.boardGrid[i - 1][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i - 1][j].getValue() != -1) {
                        this.boardGrid[i - 1][j].setValue(this.boardGrid[i - 1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i - 1][j + 1].getValue() != -1) {
                        this.boardGrid[i - 1][j + 1].setValue(this.boardGrid[i - 1][j + 1].getValue() + 1);
                    }

                    // Mid row
                    if (this.boardGrid[i][j - 1].getValue() != -1) {
                        this.boardGrid[i][j - 1].setValue(this.boardGrid[i][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i][j + 1].getValue() != -1) {
                        this.boardGrid[i][j + 1].setValue(this.boardGrid[i][j + 1].getValue() + 1);
                    }
                }
                // Left edge
                else if (i != 0 && j == 0 && i != this.boardGrid.length - 1 && j != this.boardGrid[0].length - 1) {
                    // Top row
                    if (this.boardGrid[i - 1][j].getValue() != -1) {
                        this.boardGrid[i - 1][j].setValue(this.boardGrid[i - 1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i - 1][j + 1].getValue() != -1) {
                        this.boardGrid[i - 1][j + 1].setValue(this.boardGrid[i - 1][j + 1].getValue() + 1);
                    }

                    // Mid row
                    if (this.boardGrid[i][j + 1].getValue() != -1) {
                        this.boardGrid[i][j + 1].setValue(this.boardGrid[i][j + 1].getValue() + 1);
                    }

                    // Bottom row
                    if (this.boardGrid[i + 1][j].getValue() != -1) {
                        this.boardGrid[i + 1][j].setValue(this.boardGrid[i + 1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i + 1][j + 1].getValue() != -1) {
                        this.boardGrid[i + 1][j + 1].setValue(this.boardGrid[i + 1][j + 1].getValue() + 1);
                    }
                }
                // Right edge
                else if (i != 0 && j != 0 && i != this.boardGrid.length - 1 && j == this.boardGrid[0].length - 1) {
                    // Top row
                    if (this.boardGrid[i - 1][j - 1].getValue() != -1) {
                        this.boardGrid[i - 1][j - 1].setValue(this.boardGrid[i - 1][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i - 1][j].getValue() != -1) {
                        this.boardGrid[i - 1][j].setValue(this.boardGrid[i - 1][j].getValue() + 1);
                    }

                    // Mid row
                    if (this.boardGrid[i][j - 1].getValue() != -1) {
                        this.boardGrid[i][j - 1].setValue(this.boardGrid[i][j - 1].getValue() + 1);
                    }

                    // Bottom row
                    if (this.boardGrid[i + 1][j - 1].getValue() != -1) {
                        this.boardGrid[i + 1][j - 1].setValue(this.boardGrid[i + 1][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i + 1][j].getValue() != -1) {
                        this.boardGrid[i + 1][j].setValue(this.boardGrid[i + 1][j].getValue() + 1);
                    }
                }
                // Top left corner
                else if (i == 0 && j == 0) {
                    // Mid row
                    if (this.boardGrid[i][j + 1].getValue() != -1) {
                        this.boardGrid[i][j + 1].setValue(this.boardGrid[i][j + 1].getValue() + 1);
                    }

                    // Bottom row
                    if (this.boardGrid[i + 1][j].getValue() != -1) {
                        this.boardGrid[i + 1][j].setValue(this.boardGrid[i + 1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i + 1][j + 1].getValue() != -1) {
                        this.boardGrid[i + 1][j + 1].setValue(this.boardGrid[i + 1][j + 1].getValue() + 1);
                    }
                }
                // Top right corner
                else if (i == 0 && j == this.boardGrid[0].length - 1) {
                    // Mid row
                    if (this.boardGrid[i][j - 1].getValue() != -1) {
                        this.boardGrid[i][j - 1].setValue(this.boardGrid[i][j - 1].getValue() + 1);
                    }

                    // Bottom row
                    if (this.boardGrid[i + 1][j - 1].getValue() != -1) {
                        this.boardGrid[i + 1][j - 1].setValue(this.boardGrid[i + 1][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i + 1][j].getValue() != -1) {
                        this.boardGrid[i + 1][j].setValue(this.boardGrid[i + 1][j].getValue() + 1);
                    }
                }
                // Bottom left corner
                else if (i == this.boardGrid[0].length - 1 && j == 0) {
                    // Top row
                    if (this.boardGrid[i - 1][j].getValue() != -1) {
                        this.boardGrid[i - 1][j].setValue(this.boardGrid[i - 1][j].getValue() + 1);
                    }
                    if (this.boardGrid[i - 1][j + 1].getValue() != -1) {
                        this.boardGrid[i - 1][j + 1].setValue(this.boardGrid[i - 1][j + 1].getValue() + 1);
                    }

                    // Mid row
                    if (this.boardGrid[i][j + 1].getValue() != -1) {
                        this.boardGrid[i][j + 1].setValue(this.boardGrid[i][j + 1].getValue() + 1);
                    }
                }

                // Bottom right corner
                else if (i == this.boardGrid[0].length - 1 && j == this.boardGrid[0].length - 1) {
                    // Top row
                    if (this.boardGrid[i - 1][j - 1].getValue() != -1) {
                        this.boardGrid[i - 1][j - 1].setValue(this.boardGrid[i - 1][j - 1].getValue() + 1);
                    }
                    if (this.boardGrid[i - 1][j].getValue() != -1) {
                        this.boardGrid[i - 1][j].setValue(this.boardGrid[i - 1][j].getValue() + 1);
                    }

                    // Mid row
                    if (this.boardGrid[i][j - 1].getValue() != -1) {
                        this.boardGrid[i][j - 1].setValue(this.boardGrid[i][j - 1].getValue() + 1);
                    }
                }

            }
                
            }
        }
    };

    callRevealAdjacentTiles = (evt) => {
        let currentX = evt.target.x;
        let currentY = evt.target.y;
        this.revealAdjacentTiles(currentX, currentY);
    };

    revealAdjacentTiles = (currentX, currentY) => {
        let tile = this.boardGrid[currentX][currentY];
        console.log(currentX, currentY);
        console.log(tile);
        console.log(tile.getValue());
        
        while (tile.getValue() == 0){
            let tileElement = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]")
            tileElement.style.color = "red";

            //Check Bottom
            if (currentX != this.boardGrid.length-1){
                if (this.boardGrid[currentX+1][currentY].getValue() == 0){
                    this.revealAdjacentTiles(currentX+1, currentY);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            //Check Top
            if (currentX != 0){
                if (this.boardGrid[currentX-1][currentY].getValue() == 0){
                    this.revealAdjacentTiles(currentX-1, currentY);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            //Check Left
            if (currentY != 0){
                if (this.boardGrid[currentX][currentY-1].getValue() == 0){
                    this.revealAdjacentTiles(currentX, currentY-1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY-1}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            //Check Right
            if (currentY != this.boardGrid[0].length-1){
                if (this.boardGrid[currentX][currentY+1].getValue() == 0){
                    this.revealAdjacentTiles(currentX, currentY+1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY+1}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            //Check Top Left
            if (currentX != 0 && currentY != 0){
                if (this.boardGrid[currentX-1][currentY-1].getValue() == 0){
                    this.revealAdjacentTiles(currentX-1, currentY-1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY-1}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            //Check Top Right
            if (currentX != 0 && currentY != this.boardGrid[0].length-1){
                if (this.boardGrid[currentX-1][currentY+1].getValue() == 0){
                    this.revealAdjacentTiles(currentX-1, currentY+1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX-1}/${currentY+1}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            //Check Bottom Left
            if (currentX != this.boardGrid.length-1 && currentY != 0){
                if (this.boardGrid[currentX+1][currentY-1].getValue() == 0){
                    this.revealAdjacentTiles(currentX+1, currentY-1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY-1}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            //Check Bottom Right
            if (currentX != this.boardGrid.length-1 && currentY != this.boardGrid[0].length-1){
                if (this.boardGrid[currentX+1][currentY+1].getValue() == 0){
                    this.revealAdjacentTiles(currentX+1, currentY+1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";
                    
                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX+1}/${currentY+1}`) + "]");
                    if (adjacentTileElement.textContent != "0"){
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }


            

            return;
        }
    };

    
}

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

    gameBoard = new Board("hard");
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