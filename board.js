/**
 * Gameboard that contains current game info and a fieldset element containing a number of tile elements based on the difficulty passed in
 *  */ 
class Board {
    difficulty;
    gridSizeX;
    gridSizeY;
    mineCount;
    remainingTiles;
    buttonGridWidth;
    boardGrid = [];
    pageElement;
    timerInterval;

    /**Sets game attributes based on the difficulty paramater,
    * then generates values for a board based on the attributes set,
    * and builds a DOM element using the board values
    * @param difficulty difficulty value as a string, used to determine gameboard information (i.e. length, width, mine count)
    * */
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.setDifficultyValues(difficulty);
        this.remainingTiles = (this.gridSizeX * this.gridSizeY) - this.mineCount;
        this.generateStartBoardValues();
        this.shuffleBoard();
        this.convertTo2DArray();
        this.incrementAdjacentMineTiles();
        this.buildPageElement();
    }

    /**
     * Resets the counter element to 0 for a new game
     * */
    static resetCounter = () => {
        $("#counter").textContent = "000";
    }

    /**
     * Starts the timer when a new game is selected
     * */
    static startTimer = () => {
        this.timerInterval = setInterval(this.incrementTimer, 1000);
        $("#timer").interval = this.timerInterval;
    };

    /**
     * Increments the timer while a new game is running
     * Maintains leading zeros
     * */
    static incrementTimer = () => {
        $("#timer").textContent = ('000' + (parseInt($("#timer").textContent) + 1)).slice(-3);
    };

    /**
     * Resets the timer element to 0 for a new game when reset it clicked
     * */
    static resetTimer = () => {
        $("#timer").textContent = "000";
        clearInterval(this.timerInterval);
    };

    /**
     * Resets the page to its starting layout to start a new game
     * */
    static resetPage = () => {
        this.showMenuButtons();
        $("#board").remove();
        gameResult.textContent = "";
    };

    /**
     * Hides the reset button and shows menu buttons associated with choosing difficulty 
     * */
    static showMenuButtons = () => {
        $("#easy").hidden = false;
        $("#medium").hidden = false;
        $("#hard").hidden = false;
        $("#reset").hidden = true;
    };

    /**
     * Hides menu buttons associated with choosing difficulty and shows the reset button
     * */
    hideMenuButtons = () => {
        $("#easy").hidden = true;
        $("#medium").hidden = true;
        $("#hard").hidden = true;
        $("#reset").hidden = false;
    };

    /**
     * Flags a clicked tile by setting its text to "#" to indicate that the user suspects the tile to be a mine
     * @param {event} evt - evt that triggered the call, used to determine which game tile will be flagged
     */
    setFlag = (evt) => {
        let currentButton = evt.target;
        if (currentButton.textContent == "#") {
            currentButton.textContent = "?";
            currentButton.style.color = "black";
        }
        else if (currentButton.isClicked == "false") {
            currentButton.textContent = "#";
            currentButton.style.color = "purple";
        }
    }

    /**
     * Sets board values based on the input difficulty. Values include board x and y dimensions, the number of mines and the width of the DOM game board element
     * @param {string} currentDifficulty - string holding the difficulty value, used to determine board values
     */
    setDifficultyValues(currentDifficulty) {
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

    /**
     * Constructs a DOM element to be used as the gameboard containing a number of tiles
     */
    buildPageElement() {
        // Sets Initial DOM attributes
        let buttonGrid = document.createElement("fieldset");
        buttonGrid.id = "board";
        buttonGrid.style.padding = "20px";
        buttonGrid.style.margin = "auto";
        buttonGrid.style.width = this.buttonGridWidth;

        // Construct rows of tiles
        for (let i = 0; i < this.gridSizeX; i++) {
            for (let j = 0; j < this.gridSizeY; j++) {
                // Create button to act as a tile
                this.boardGrid[i][j].buildPageElement();
                const currentButton = this.boardGrid[i][j].pageElement;

                // To cheat uncomment the line below and comment the line in tile.js setting textContent to "?" to cheat
                // currentButton.textContent = this.boardGrid[currentButton.x][currentButton.y].getValue();
                currentButton.actualValue = this.boardGrid[i][j].getValue();

                // Add left and right click functionality for a tile
                currentButton.addEventListener("click", this.callRevealAdjacentTiles);
                currentButton.addEventListener("contextmenu", this.setFlag);

                // Append tile to the game board
                buttonGrid.appendChild(currentButton);
            }
            // create and append a br element to break the row
            buttonGrid.appendChild(document.createElement("br"));
        }
        // Store the constructed DOM game board element in the board object
        this.pageElement = buttonGrid;
    };

    // 
    // 
    // 
    /**
     * Generates starting values for board
     * Starts with a 1D array filled with (-1)s to represent mines
     * Then fill the remaining button tiles with 0s
     */
    generateStartBoardValues() {
        // Fill the board with mine tiles equal to the mine count set by the game difficulty
        for (let i = 0; i < this.mineCount; i++) {
            this.boardGrid.push(new Tile(-1));
        }

        // Fill the remaining board space with non-mine tiles of unspecified value
        while (this.boardGrid.length < this.gridSizeX * this.gridSizeY) {
            this.boardGrid.push(new Tile(0))
        }
    };

   /**
    * Shuffles the order of mine and non-mine tiles in the game board
    * Sorting Explanation:
    *   For each 2 values being compared, a random number is generated between 0 and 1                    
    *   0.5 is then subtracted from the random number, creating an effective random range of -0.5 to 0.5
    *   Sort order is then determined based on the built-in compareFn(a,b) from the .sort's logic
    *   if the random number is postive, sort the first value after the second value (b,a)
    *   if the number is negative, sort the second after the first (a,b)
    *   if the number is 0, maintain the original sort order
    */
    shuffleBoard() {
        this.boardGrid.sort(() => Math.random() - 0.5);
    }

    /**
     * Converts 1D array to 2D based on length of the grid
     * loop through board length and add values to a temporary row
     * when i is divisible by the length of 1 row, push the row to the new array and clear the temp row
     */
    convertTo2DArray() {
        let new2Dboard = [];
        let tempRow = [];
        for (let i = 0; i <= this.boardGrid.length - 1; i++) {
            this.boardGrid[i].setX(new2Dboard.length);
            this.boardGrid[i].setY(tempRow.length);
            tempRow.push(this.boardGrid[i]);

            if (i != 0 && (i + 1) % this.gridSizeY == 0) {
                new2Dboard.push(tempRow);
                tempRow = [];
            }
        }
        this.boardGrid = new2Dboard;
    };

    /**
     * Loops through the 2D board array and increments the values of tiles adjacent to a mine by 1
     * If the tile is not on the edge of the board, all 8 adjacent positions are checked
     * If it is on an edge, the positions that would be outside the board will not be checked
     */
    incrementAdjacentMineTiles() {
        for (let i = 0; i < this.boardGrid.length; i++) {
            for (let j = 0; j < this.boardGrid[0].length; j++) {
                //Non edge-case
                if (this.boardGrid[i][j].getValue() == -1) {
                    if (i != 0 && j != 0 && i != this.boardGrid.length - 1 && j != this.boardGrid[0].length - 1) {
                        // console.log("-".repeat(30));
                        // console.log("above"," : ",this.boardGrid[i-1][j-1], this.boardGrid[i-1][j], this.boardGrid[i-1][j+1]);
                        // console.log(i,j,"c  : ",this.boardGrid[i][j-1], this.boardGrid[i][j], this.boardGrid[i][j+1]);
                        // console.log("below"," : ",this.boardGrid[i+1][j-1], this.boardGrid[i+1][j], this.boardGrid[i+1][j+1]);
                        // console.log("-".repeat(30));

                        //top row
                        if (this.boardGrid[i - 1][j - 1].getValue() != -1) {
                            this.boardGrid[i - 1][j - 1].setValue(this.boardGrid[i - 1][j - 1].getValue() + 1);
                        }
                        if (this.boardGrid[i - 1][j].getValue() != -1) {
                            this.boardGrid[i - 1][j].setValue(this.boardGrid[i - 1][j].getValue() + 1);
                        }
                        if (this.boardGrid[i - 1][j + 1].getValue() != -1) {
                            this.boardGrid[i - 1][j + 1].setValue(this.boardGrid[i - 1][j + 1].getValue() + 1);
                        }

                        //mid row
                        if (this.boardGrid[i][j - 1].getValue() != -1) {
                            this.boardGrid[i][j - 1].setValue(this.boardGrid[i][j - 1].getValue() + 1);
                        }
                        if (this.boardGrid[i][j + 1].getValue() != -1) {
                            this.boardGrid[i][j + 1].setValue(this.boardGrid[i][j + 1].getValue() + 1);
                        }

                        //bottom row
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

    /**
     * Starts the recursive function from the tile clicked
     * @param {event} evt - evt that called the function, used to start the recursive check of adjacent tiles at the position of the tile clicked
     */
    callRevealAdjacentTiles = (evt) => {
        let currentX = evt.target.x;
        let currentY = evt.target.y;
        this.revealAdjacentTiles(currentX, currentY);
    };

    /**
     * Recursively checks tiles adjacent to a clicked tile, to reveal any non-mine tiles
     * Each of the 8 adjacent position to a tile is checked and if "empty" tiles are found, the function is called on them recursivley
     * Adjacent "number" tiles are revealed and colored, but not called recursively
     * The base case occurs when a tile has no adjacent non-mine tiles
     * @param {string} currentX - x coordinate of the current tile being recursively checked for adjacent non-mine tiles
     * @param {string} currentY - y coordinate of the current tile being recursively checked for adjacent non-mine tiles
     * @returns none - return is used to escape recursive calls when the base case is hit
     */
    revealAdjacentTiles = (currentX, currentY) => {
        let tile = this.boardGrid[currentX][currentY];

        while (tile.getValue() == 0) {
            let tileElement = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY}`) + "]")
            tileElement.style.color = tile.determineTileColor((tile.getValue()));
            if (tileElement.isClicked == "false") {
                $("#playArea").remainingTiles -= 1;
                console.log($("#playArea").remainingTiles);
            }
            tileElement.isClicked = "true";
            //Check Bottom
            if (currentX != this.boardGrid.length - 1) {
                if (this.boardGrid[currentX + 1][currentY].getValue() == 0) {
                    this.revealAdjacentTiles(currentX + 1, currentY);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX + 1}/${currentY}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
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
            if (currentX != 0) {
                if (this.boardGrid[currentX - 1][currentY].getValue() == 0) {
                    this.revealAdjacentTiles(currentX - 1, currentY);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX - 1}/${currentY}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
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
            if (currentY != 0) {
                if (this.boardGrid[currentX][currentY - 1].getValue() == 0) {
                    this.revealAdjacentTiles(currentX, currentY - 1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY - 1}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
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
            if (currentY != this.boardGrid[0].length - 1) {
                if (this.boardGrid[currentX][currentY + 1].getValue() == 0) {
                    this.revealAdjacentTiles(currentX, currentY + 1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX}/${currentY + 1}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
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
            if (currentX != 0 && currentY != 0) {
                if (this.boardGrid[currentX - 1][currentY - 1].getValue() == 0) {
                    this.revealAdjacentTiles(currentX - 1, currentY - 1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX - 1}/${currentY - 1}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
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
            if (currentX != 0 && currentY != this.boardGrid[0].length - 1) {
                if (this.boardGrid[currentX - 1][currentY + 1].getValue() == 0) {
                    this.revealAdjacentTiles(currentX - 1, currentY + 1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX - 1}/${currentY + 1}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
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
            if (currentX != this.boardGrid.length - 1 && currentY != 0) {
                if (this.boardGrid[currentX + 1][currentY - 1].getValue() == 0) {
                    this.revealAdjacentTiles(currentX + 1, currentY - 1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX + 1}/${currentY - 1}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
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
            if (currentX != this.boardGrid.length - 1 && currentY != this.boardGrid[0].length - 1) {
                if (this.boardGrid[currentX + 1][currentY + 1].getValue() == 0) {
                    this.revealAdjacentTiles(currentX + 1, currentY + 1);
                }
                else {
                    this.boardGrid[currentX][currentY].setValue(2);
                    tileElement.textContent = "0";

                    let adjacentTileElement = document.querySelector("[id=" + CSS.escape(`${currentX + 1}/${currentY + 1}`) + "]");
                    if (adjacentTileElement.textContent != "0") {
                        adjacentTileElement.textContent = adjacentTileElement.actualValue;
                        if (adjacentTileElement.isClicked == "false") {
                            $("#playArea").remainingTiles -= 1;
                            console.log($("#playArea").remainingTiles);
                        }
                        adjacentTileElement.isClicked = "true";
                        adjacentTileElement.style.color = tile.determineTileColor((adjacentTileElement.actualValue));
                    }
                }
            }
            else {
                this.boardGrid[currentX][currentY].setValue(2);
                tileElement.textContent = "0";
            }

            // Base Case, no adjacent tiles are "empty"
            return;
        }
    };
}