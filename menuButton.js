/**
 * Class to represent a menu button for handling game options
 * @author Noah Forward
 */
class MenuButton {
    id;
    pageElement;

    /**
     * Builds a menu button object, sets it's type and builds it's DOM element based on difficulty
     * 
     */
    constructor(type) {
        this.id = type;
        this.buildPageElement();
    }

    /**
     * Hides buttons associated with choosing difficulty and shows the reset button
     */
    static hideMenuButtons = () => {
        $("#easy").hidden = true;
        $("#medium").hidden = true;
        $("#hard").hidden = true;
        $("#reset").hidden = false;
    };

    /**
     * Constructs the DOM element for the object based on it's type
     */
    buildPageElement() {
        let menuButton = document.createElement("button");
        if (this.id == "easy") {
            menuButton.textContent = "Beginner";
            menuButton.id = "easy";
            menuButton.classList = "menu";
        }
        else if (this.id == "medium") {
            menuButton.textContent = "Intermediate";
            menuButton.id = "medium";
            menuButton.classList = "menu";
        }
        else if (this.id == "hard") {
            menuButton.textContent = "Expert";
            menuButton.id = "hard";
            menuButton.classList = "menu";
        }
        else if (this.id == "reset") {
            menuButton.textContent = "Reset";
            menuButton.id = "reset";
            menuButton.classList = "menu";
            menuButton.hidden = true;
        }
        this.pageElement = menuButton;
    }

}