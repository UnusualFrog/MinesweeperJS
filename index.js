const $ = selector => document.querySelector(selector);

const createBoard = () => {
    if ($("#playArea").difficulty == "easy"){
        size = 9;
        mines = 10;
        width = "225px"
    }
    else if ($("#playArea").difficulty == "medium"){
        size = 16;
        mines = 40;
        width = "400px"
    }
    else {
        size = 22;
        mines = 99;
        width = "1650px"
    }
    let root = document.createElement("div");
    root.id = "board";
    root.style.padding = "20px";
    root.style.margin = "auto"  
    root.style.width = width;

    var size;
    var mines;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const node = document.createElement("button");
            node.textContent = "⯀";
            
            node.style.backgroundColor = "White";
            node.style.fontFamily = 'Courier New, monospace';
            node.style.width = "25px";
            node.style.height = "25px";

            root.appendChild(node);
        }
        // create and append a br element to break the lines.
        root.appendChild(document.createElement("br"));
    }
    $("#playArea").appendChild(root);
    console.log($("#playArea").difficulty);
};

const hideButtons = () => {
    $("#easy").hidden = true;
    $("#medium").hidden = true;
    $("#hard").hidden = true;
};

const showButtons = () => {
    $("#easy").hidden = false;
    $("#medium").hidden = false;
    $("#hard").hidden = false;
};

const setDifficulty = (evt) => {
    playArea.difficulty = evt.target.id;
};

const resetPage = () => {
    showButtons();
    $("#board").remove();
};

document.addEventListener("DOMContentLoaded", () => {
    let title = document.createElement("h1");
    title.textContent = "Welcome to Minesweeper"
    $("main").appendChild(title); 

    let playArea = document.createElement("div");
    playArea.id = "playArea";

    let easy = document.createElement("button");
    let medium = document.createElement("button");
    let hard = document.createElement("button");
    let reset = document.createElement("button");

    easy.textContent = "Beginner";
    medium.textContent = "Intermediate";
    hard.textContent = "Expert";
    reset.textContent = "Reset";

    easy.id = "easy";
    medium.id = "medium";
    hard.id = "hard";
    reset.id = "reset";

    easy.classList = "menu";
    medium.classList = "menu";
    hard.classList = "menu";
    reset.classList = "menu";

    easy.addEventListener("click", hideButtons)
    medium.addEventListener("click", hideButtons)
    hard.addEventListener("click", hideButtons)
    reset.addEventListener("click", resetPage)

    easy.addEventListener("click", setDifficulty)
    medium.addEventListener("click", setDifficulty)
    hard.addEventListener("click", setDifficulty)

    easy.addEventListener("click", createBoard)
    medium.addEventListener("click", createBoard)
    hard.addEventListener("click", createBoard)

    playArea.appendChild(easy);
    playArea.appendChild(medium);
    playArea.appendChild(hard);
    playArea.appendChild(reset);

    $("main").appendChild(playArea);
});