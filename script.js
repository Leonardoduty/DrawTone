Input = document.querySelector("#word_In");
art_canvas = document.querySelector("#artwork");

let preword = [];

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

    words.forEach(function(word) {

    if (!document.querySelector(`[data-word="${word}"]`)) {

        const square = document.createElement("div");
        square.className = "square";
        square.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        square.dataset.word = word;
        art_canvas.appendChild(square);
    }
    });
    let columns = 1;

    for (let i = 1; i <= words.length; i++) {
        const rows = Math.ceil(words.length / i);

        if (Math.abs(i - rows) < Math.abs(columns - Math.ceil(words.length / columns))) {
            columns = i;
        }
    

    }
    
    Array.from(art_canvas.children).forEach(function(square, index){
    const size = art_canvas.clientWidth / columns;

    square.style.width = `${size}px`;
    square.style.height = `${size}px`;

    const column = index % columns;
    const row = Math.floor(index / columns);

    square.style.left = `${column * size}px`;
    square.style.top = `${row * size}px`;

    });
    preword = words;
});