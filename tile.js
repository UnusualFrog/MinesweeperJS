const $ = selector => document.querySelector(selector);

class Tile {
    value;
    x;
    y;
    pageElement;
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
    }

    getValue() {
        return this.value;
    }

    setValue(newValue) {
        this.value = newValue;
    }

    getX() {
        return this.x;
    }
    setX(newX) {
        this.x = newX;
    }

    getY() {
        return this.y;
    }

    setY(newY) {
        this.y = newY;
    }

    buildPageElement() {
        const currentButton = document.createElement("button");
        currentButton.id = this.x + "/" + this.y;
        currentButton.classList = "gridButton";
        currentButton.x = this.x;
        currentButton.y = this.y;
        currentButton.textContent = "?";
        currentButton.isClicked = "false";

        currentButton.addEventListener("click", this.revealClickedTile);
        currentButton.addEventListener("click", this.triggerLoss);

        // Style the button
        currentButton.style.backgroundColor = "#CCCCCC";
        //currentButton.style.color = "#CCCCCC";
        currentButton.style.color = "Black";
        currentButton.style.fontFamily = 'Courier New, monospace';
        currentButton.style.width = "25px";
        currentButton.style.height = "25px";
        this.pageElement = currentButton;
    }

    // Reveals the value of the tile clicked, sets its color and increments the click counter
    revealClickedTile = (evt) => {
        if (evt.target.isClicked == "false") {
            evt.target.isClicked = "true";
            evt.target.textContent = evt.target.actualValue;
            evt.target.style.color = this.determineTileColor(evt.target.actualValue);
            this.incrementClickCounter();
        };
    };

    // Triggers a game loss and disables the board when a mine (-1) tile is clicked
    triggerLoss = (evt) => {
        if (evt.target.actualValue == -1) {
            $("#gameResult").textContent = "You Lose!";
            $("#gameResult").style.color = "red";
            $("#board").disabled = "disabled";
            // clearInterval(timerInterval);
        }
    };

    // Returns a color to be used for styling based on the tile value passed on
    // colors codes are based on official minesweeper colors
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

    //Increments counter the first time a grid button is clicked
    incrementClickCounter = () => {
        $("#counter").textContent = ('000' + (parseInt($("#counter").textContent) + 1)).slice(-3);
    }
}