const $ = selector => document.querySelector(selector);

class Tile {
    value;
    x;
    y;
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
        let str = ""
        for (let i = 0; i < this.boardGrid.length;i++){
            for (let j = 0; j < this.boardGrid[0].length;j++){
                str += this.boardGrid[i][j].getValue();
                
            }
            console.log(str)
            str = ""
        }
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
                const currentButton = document.createElement("button");
                currentButton.id = i + "/" + j;
                currentButton.classList = "gridButton";
                currentButton.x = i;
                currentButton.y = j;
                // currentButton.textContent = "?";
                currentButton.textContent = this.boardGrid[i][j].getValue();
                
                currentButton.actualValue = this.boardGrid[i][j].getValue();
                currentButton.isClicked = "false";
                // currentButton.addEventListener("click", revealClickedTile);
                // currentButton.addEventListener("click", callRevealAdjacentTiles);
                // currentButton.addEventListener("click", triggerLoss);
    
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

    gameBoard = new Board("easy");

    playArea.appendChild(gameBoard.pageElement);

    $("main").appendChild(playArea);
});