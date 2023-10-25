const $ = selector => document.querySelector(selector);

const createBoard = () => {
    let root = document.createElement("div");
    root.id = "board";
    root.style.padding = "20px";
    root.style.border = "2px solid black";
    root.style.margin = "auto"  

    var size;
    var mines;

    if ($("#playArea").difficulty == "easy"){
        // console.log("build easy")
        size = 9;
        mines = 10;
    }
    else if ($("#playArea").difficulty == "medium"){
        // console.log("build med")
        size = 16;
        mines = 40;
    }
    else {
        // console.log("build hard")
        size = 22;
        mines = 99;
    }

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

const setDifficulty = (evt) => {
    playArea.difficulty = evt.target.id;
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

    easy.textContent = "Beginner";
    medium.textContent = "Intermediate";
    hard.textContent = "Expert";

    easy.id = "easy";
    medium.id = "medium";
    hard.id = "hard";

    easy.addEventListener("click", hideButtons)
    medium.addEventListener("click", hideButtons)
    hard.addEventListener("click", hideButtons)

    easy.addEventListener("click", setDifficulty)
    medium.addEventListener("click", setDifficulty)
    hard.addEventListener("click", setDifficulty)

    easy.addEventListener("click", createBoard)
    medium.addEventListener("click", createBoard)
    hard.addEventListener("click", createBoard)

    playArea.appendChild(easy);
    playArea.appendChild(medium);
    playArea.appendChild(hard);

    $("main").appendChild(playArea);
});