const $ = selector => document.querySelector(selector);

const setDifficulty = (evt) => {
    playArea.difficulty = evt.target.id;
};

const resetPage = () => {
    showButtons();
    $("#board").remove();
};

const hideButtons = () => {
    $("#easy").hidden = true;
    $("#medium").hidden = true;
    $("#hard").hidden = true;
    $("#reset").hidden = false;
};

const showButtons = () => {
    $("#easy").hidden = false;
    $("#medium").hidden = false;
    $("#hard").hidden = false;
    $("#reset").hidden = true;
};

const generateRandomBoardValues = () => {
    let startBoard = [];
    for(let i = 0; i< $("#playArea").mines;i++){
        startBoard.push(-1);
    }

    while (startBoard.length < $("#playArea").size * $("#playArea").size){
        startBoard.push(Math.floor(Math.random() * 4))
    }
    console.log(...startBoard);

    startBoard.sort(() => Math.random() - 0.5)
    console.log(...startBoard);

    let sorted2Dboard = [];
    let tempRow = [];
    for (let i = 0;i <= startBoard.length;i++){
        tempRow.push(startBoard[i]);
        if (i != 0 && i % $("#playArea").size == 0){
            sorted2Dboard.push(tempRow);
            tempRow = [];
        }
    }
    let tenthProblem = sorted2Dboard[0].pop();
    sorted2Dboard[sorted2Dboard.length-1][sorted2Dboard.length-1] = tenthProblem;
    console.log(...sorted2Dboard);

    return sorted2Dboard;
}

const createBoard = () => {
    var size;
    var mines;
    var width;
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
    $("#playArea").mines = mines;
    $("#playArea").size = size;

    let root = document.createElement("div");
    root.id = "board";
    root.style.padding = "20px";
    root.style.margin = "auto"  
    root.style.width = width;

    
    let buttonValues = generateRandomBoardValues();
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const node = document.createElement("button");
            //node.textContent = "⯀";
            
            node.style.backgroundColor = "#CCCCCC";
            //node.style.color = "#CCCCCC";
            node.style.color = "Black";
            node.style.fontFamily = 'Courier New, monospace';
            node.style.width = "25px";
            node.style.height = "25px";

            node.textContent = buttonValues[i][j];

            root.appendChild(node);
        }
        // create and append a br element to break the lines.
        root.appendChild(document.createElement("br"));
    }
    $("#playArea").appendChild(root);
    generateRandomBoardValues();
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
    
    reset.hidden = true;

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