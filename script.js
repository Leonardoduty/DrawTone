Input = document.querySelector("#word_In");
art_canvas = document.querySelector("#artwork");

let preword = [];
let columns = 1;

function calculateColumns(count){
    return Math.ceil(Math.sqrt(count));
}


function resizeSquares() {
    const count = art_canvas.children.length;

    if (count === 0) {
        return;
    }

    const columns = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / columns);

    const canvasWidth = art_canvas.clientWidth;
    const canvasHeight = art_canvas.clientHeight;

    const size = Math.min(
        canvasWidth / columns,
        canvasHeight / rows
    );

    const gridWidth = columns * size;
    const gridHeight = rows * size;

    const offsetX = (canvasWidth - gridWidth) / 2;
    const offsetY = (canvasHeight - gridHeight) / 2;

    Array.from(art_canvas.children).forEach(function(square, index) {

        const column = index % columns;
        const row = Math.floor(index / columns);

        square.style.width = `${size}px`;
        square.style.height = `${size}px`;

        square.style.left = `${offsetX + column * size}px`;
        square.style.top = `${offsetY + row * size}px`;
    });
}

Input.addEventListener("input", function(event){
    const text = Input.value.trim();

    if (text === "") {
        art_canvas.innerHTML = "";
        preword = [];
        return;
    }
    const words = text.split(/\s+/);
    const del_wor = preword.filter(word => !words.includes(word));

    del_wor.forEach(function(word){
        const square = document.querySelector(`[data-word="${word}"]`)
        if(square){
            square.remove()
        }
    });

    words.forEach(function(word){

    if (!document.querySelector(`[data-word="${word}"]`)) {

        const square = document.createElement("div");
        square.className = "square";
        square.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        square.dataset.word = word;
        art_canvas.appendChild(square);
    }
    });

    columns = calculateColumns(words.length);
    
    resizeSquares()
    preword = words;
});

window.addEventListener("resize", function(){
    const currentRatio = art_canvas.style.width
        ? art_canvas.clientWidth / art_canvas.clientHeight
        : 1;
    if (art_canvas.style.width){
        const height = window.innerHeight;
        const width = height * currentRatio;
        if (width <= window.innerWidth){
            art_canvas.style.width = `${width}px`;
            art_canvas.style.height = `${height}px`;
        } else {
            art_canvas.style.width = `${window.innerWidth}px`;
            art_canvas.style.height = `${window.innerWidth / currentRatio}px`;
        }
        art_canvas.style.left = "50%";
        art_canvas.style.top = "50%";
        art_canvas.style.transform = "translate(-50%, -50%)";
    }
    resizeSquares();
});

const toolbarButtons = document.querySelectorAll(
    ".toolbar_l button, .toolbar_r button"
);


const boldBtn = document.querySelector('.toolbar_l button[title="Bold"]');
const italicBtn = document.querySelector('.toolbar_l button[title="Italic"]');
const underlineBtn = document.querySelector('.toolbar_l button[title="Underline"]');
const strikeBtn = document.querySelector('.toolbar_l button[title="Strikethrough"]');

let undoStack = [Input.value];
let redoStack = [];
let changingHistory = false;

Input.addEventListener("input", function() {
    if (changingHistory) {
        return;
    }
    undoStack.push(Input.value);
    redoStack = [];
});

const undoBtn = document.querySelector('.toolbar_l button[title="Undo"]');
const redoBtn = document.querySelector('.toolbar_l button[title="Redo"]');

undoBtn.addEventListener("click", function() {
    if (undoStack.length <= 1) {
        return;
    }
    changingHistory = true;
    redoStack.push(undoStack.pop());
    Input.value = undoStack[undoStack.length - 1];
    Input.dispatchEvent(new Event("input"));
    changingHistory = false;
});

redoBtn.addEventListener("click", function() {
    if (redoStack.length === 0) {
        return;
    }
    changingHistory = true;
    const nextValue = redoStack.pop();
    undoStack.push(nextValue);
    Input.value = nextValue;
    Input.dispatchEvent(new Event("input"));
    changingHistory = false;
});

boldBtn.addEventListener("click", function() {
    Input.style.fontWeight =
        Input.style.fontWeight === "700" ? "400" : "700";
    boldBtn.classList.toggle("active");
});

italicBtn.addEventListener("click", function() {
    Input.style.fontStyle =
        Input.style.fontStyle === "italic" ? "normal" : "italic";
    italicBtn.classList.toggle("active");
});

underlineBtn.addEventListener("click", function() {
    Input.style.textDecoration =
        Input.style.textDecoration === "underline" ? "none" : "underline";
    underlineBtn.classList.toggle("active");
});

strikeBtn.addEventListener("click", function() {
    Input.style.textDecoration =
        Input.style.textDecoration === "line-through" ? "none" : "line-through";
    strikeBtn.classList.toggle("active");
});

const canvasBtn = document.querySelector('.toolbar_r button[title="Canvas"]');
const canvasMenu = document.querySelector("#canvasMenu");
const canvasOptions = canvasMenu.querySelectorAll("button");

canvasBtn.addEventListener("click", function() {
    canvasMenu.classList.toggle("open");
});

function changeCanvasRatio(ratio){
    const values = ratio.split("/");
    const widthRatio = Number(values[0]);
    const heightRatio = Number(values[1]);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let width;
    let height;

    if (screenWidth / screenHeight > widthRatio / heightRatio) {

        height = screenHeight;
        width = height * (widthRatio / heightRatio);

    } else {

        width = screenWidth;
        height = width * (heightRatio / widthRatio);

    }

    art_canvas.style.width = `${width}px`;
    art_canvas.style.height = `${height}px`;
    art_canvas.style.left = "50%";
    art_canvas.style.top = "50%";
    art_canvas.style.transform = "translate(-50%, -50%)";
    resizeSquares();
}

canvasOptions.forEach(function(option) {
    option.addEventListener("click", function() {
        changeCanvasRatio(option.dataset.ratio);
        canvasMenu.classList.remove("open");
    });
});

const music = document.querySelector("#lofiMusic");
const musicbtn = document.querySelector("#musicBtn");

music.volume = 0.12;

musicbtn.addEventListener("click", function(){
    if (music.paused){
        music.play();
        musicbtn.classList.add("active");


} else{
    music.pause();
    musicbtn.classList.remove("active");

}

});

const pngBtn = document.querySelector('.toolbar_r button[title="Save as PNG"]');

pngBtn.addEventListener("click", function() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = art_canvas.clientWidth;
    canvas.height = art_canvas.clientHeight;
    const squares = art_canvas.children;
    for (let square of squares) {
        const rect = square.getBoundingClientRect();
        const artworkRect = art_canvas.getBoundingClientRect();
        const x = rect.left - artworkRect.left;
        const y = rect.top - artworkRect.top;
        ctx.fillStyle = getComputedStyle(square).backgroundColor;
        ctx.fillRect(
            x,
            y,
            rect.width,
            rect.height
        );
    }
    const link = document.createElement("a");
    link.download = "drawtone-artwork.png";
    link.href = canvas.toDataURL("image/png");
    link.click();



});

const exportBtn = document.querySelector('.toolbar_r button[title="Export"]');

exportBtn.addEventListener("click", function(){

    const text = Input.value.trim();
    const words = text === "" ? [] : text.split(/\s+/);
    const ratio = art_canvas.style.aspectRatio || "Default";

    let colors = [];
    Array.from(art_canvas.children).forEach(function(square){

        colors.push(
            getComputedStyle(square).backgroundColor
        );

    });
    const exportData =
`DrawTone Artwork
Text:
${text || "(empty)"}

Word count:
${words.length}
Canvas ratio:
${ratio}

Colors:
${colors.join("\n")}
Generated with DrawTone
`;
    const file = new Blob(
        [exportData],
        { type: "text/plain" }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "drawtone-export.txt";
    link.click();
    URL.revokeObjectURL(link.href);

});

