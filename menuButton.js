class MenuButton {
    id;
    pageElement;
    
    constructor (type) {
        this.id = type;
        this.buildPageElement();
    }

    //Hides buttons associated with choosing difficulty and shows the reset button
    static hideMenuButtons = () => {
        $("#easy").hidden = true;
        $("#medium").hidden = true;
        $("#hard").hidden = true;
        $("#reset").hidden = false;
    };

    buildPageElement(){
        let menuButton = document.createElement("button");
        if (this.id == "easy"){
            menuButton.textContent = "Beginner";
            menuButton.id = "easy";
            menuButton.classList = "menu";
        }
        else if (this.id == "medium"){
            menuButton.textContent = "Intermediate";
            menuButton.id = "medium";
            menuButton.classList = "menu";
        }
        else if (this.id == "hard"){
            menuButton.textContent = "Expert";
            menuButton.id = "hard";
            menuButton.classList = "menu";
        }
        else if (this.id == "reset"){
            menuButton.textContent = "Reset";
            menuButton.id = "reset";
            menuButton.classList = "menu";
            menuButton.hidden = true;
        }
        this.pageElement = menuButton;
    }
    
}