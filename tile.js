const $ = selector => document.querySelector(selector);

/** 
* Class to represent a tile with coordinates (x,y) and a value in the grid for the game
* @author Noah Forward
*/ 
class Tile {
    value;
    x;
    y;
    pageElement;
    
    /**
    * Builds a tilte object and sets its value and coordinates
    * @param {value} value held by the tile as an integer
    * @param  {x} X coordinate of the tile's location
    * @param  {y} Y coordinate of the tile's location 
    */
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
    }

    /**
     * Get the value of the tile.
     * @returns {number} The current value of the tile.
     */
    getValue() {
        return this.value;
    }

    /**
     * Set the value of the tile.
     * @param {number} newValue - The new value to set for the tile.
     */
    setValue(newValue) {
        this.value = newValue;
    }

     /**
     * Get the x-coordinate of the tile.
     * @returns {number} The current x-coordinate of the tile.
     */
    getX() {
        return this.x;
    }

    /**
     * Set the x-coordinate of the tile.
     * @param {number} newX - The new x-coordinate to set for the tile.
     */
    setX(newX) {
        this.x = newX;
    }

    /**
     * Get the y-coordinate of the tile.
     * @returns {number} The current y-coordinate of the tile.
     */
    getY() {
        return this.y;
    }

    /**
     * Set the y-coordinate of the tile.
     * @param {number} newY - The new y-coordinate to set for the tile.
     */
    setY(newY) {
        this.y = newY;
    }

    /** 
    *Increments the counter element the first time a grid button is clicked
    */
    incrementClickCounter = () => {
        $("#counter").textContent = ('000' + (parseInt($("#counter").textContent) + 1)).slice(-3);
    }

    /**
    * Reveals the value of the tile clicked, sets its color and increments the click counter
    * Won't go through if the tile is marked as "isClicked"
    */
    revealClickedTile = (evt) => {
        if (evt.target.isClicked == "false") {
            if (evt.target.actualValue != -1) {
                $("#playArea").remainingTiles -= 1;
                console.log($("#playArea").remainingTiles);
            }
            evt.target.isClicked = "true";
            evt.target.textContent = evt.target.actualValue;
            evt.target.style.color = this.determineTileColor(evt.target.actualValue);
            this.incrementClickCounter();
        };
    };

    /** 
    * Triggers win when count of non-mine clicked tiles hits 0
    * Adds Win message to game area
    * Disables the game board and stops the timer
    */
    triggerWin = () => {
        if ($("#playArea").remainingTiles == 0) {
            console.log("You win!");
            $("#gameResult").textContent = "You win!";
            $("#gameResult").style.color = "green";
            $("#board").disabled = "disabled";
            clearInterval($("#timer").interval);
        };
    };

    /**
    * Triggers a game loss, stops the timer and disables the board when a mine (-1) tile is clicked
    * Adds loss message to game area
    */
    triggerLoss = (evt) => {
        if (evt.target.actualValue == -1) {
            $("#gameResult").textContent = "You Lose!";
            $("#gameResult").style.color = "red";
            $("#board").disabled = "disabled";
            clearInterval($("#timer").interval);
        }
    };

    /**  Returns a color to be used for styling based on the tile value passed on
    *    Color codes are based on official minesweeper colors
    * @returns {String} a string that represents a color than can be supplied to CSS styling
    */
    determineTileColor = (tileValue) => {
        if (tileValue == "-1") {
            return "orange";
        }
        else if (tileValue == "0") {
            return "#CCCCCC";
        }
        else if (tileValue == "1") {
            return "#0100FE";
        }
        else if (tileValue == "2") {
            return "#008000";
        }
        else if (tileValue == "3") {
            return "#FE0000";
        }
        else if (tileValue == "4") {
            return "#00007F";
        }
        else if (tileValue == "5") {
            return "#800000";
        }
        else if (tileValue == "6") {
            return "#008081";
        }
        else if (tileValue == "7") {
            return "#000000";
        }
        else if (tileValue == "8") {
            return "#808080";
        }
        else {
            return "#FFFFFF";
        }
    };

    /** 
    * Builds a button DOM element to represent a tile in the gameboard
    */
    buildPageElement() {
        const currentButton = document.createElement("button");
        currentButton.id = this.x + "/" + this.y;
        currentButton.classList = "gridButton";
        currentButton.x = this.x;
        currentButton.y = this.y;
        currentButton.isClicked = "false";

        // To cheat comment the line below and uncomment the line in board.js setting textContent to "this.boardGrid[currentButton.x][currentButton.y].getValue();"
        currentButton.textContent = "?";

        // Add click behaviors
        currentButton.addEventListener("click", this.revealClickedTile);
        currentButton.addEventListener("click", this.triggerLoss);
        currentButton.addEventListener("click", this.triggerWin);

        // Style the button
        currentButton.style.backgroundColor = "#CCCCCC";
        currentButton.style.color = "Black";
        currentButton.style.fontFamily = 'Courier New, monospace';
        currentButton.style.width = "25px";
        currentButton.style.height = "25px";
        this.pageElement = currentButton;
    }
}