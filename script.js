var board;
var score = 0;
var rows = 4;
var columns = 4;
var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;
var highscore = localStorage.getItem('highscore') || 0; // Retrieve highscore from localStorage or set to 0
var gameOver = false; // Add a flag to track game over


window.onload = function() {
    setGame();
    updateHighscore(); // Initialize high score display

    document.getElementById("restart-button").addEventListener("click", function() {
        restartGame();
    });
}

function setGame() {
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

document.addEventListener('keyup', (e) => {
    let moved = false; // Flag to check if a move actually happened

    if (e.code == "ArrowLeft") {
        moved = slideLeft(); // Update flag based on the slide function return
    } else if (e.code == "ArrowRight") {
        moved = slideRight();
    } else if (e.code == "ArrowUp") {
        moved = slideUp();
    } else if (e.code == "ArrowDown") {
        moved = slideDown();
    }

    if (moved) {
        setTwo();
    }

    updateScore();
    updateHighscore(); // Check and update high score

    if (isGameOver()) {
        gameOver = true;
        showGameOver();
    }
});

function updateScore() {
    document.getElementById("score").innerText = score;
}

function updateHighscore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore); // Save highscore to localStorage
    }
    document.getElementById("highscore").innerText = highscore;
}


function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}


function slideLeft() {
    let moved = false; // Initialize moved as false
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row]; // Copy the current row for comparison
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
            moved = true; // Set moved to true if the row has changed
        }
    }
    return moved; // Return if a move happened
}

function slideRight() {
    let moved = false; // Initialize moved as false
    for (let r = 0; r < rows; r++) {
        let row = board[r]; 
        let originalRow = [...row]; // Copy the current row for comparison
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
            moved = true; // Set moved to true if the row has changed
        }
    }
    return moved; // Return if a move happened
}

function slideUp() {
    let moved = false; // Initialize moved as false
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = [...row]; // Copy the current row for comparison
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
            moved = true; // Set moved to true if the row has changed
        }
    }
    return moved; // Return if a move happened
}

function slideDown() {
    let moved = false; // Initialize moved as false
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = [...row]; // Copy the current row for comparison
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
            moved = true; // Set moved to true if the row has changed
        }
    }
    return moved; // Return if a move happened
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

document.addEventListener('touchstart', function(e) {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', function(e) {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture();
}, false);

function handleGesture() {
    var dx = touchendX - touchstartX;
    var dy = touchendY - touchstartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            slideRight();
            setTwo();
        } else {
            slideLeft();
            setTwo();
        }
    } else {
        if (dy > 0) {
            slideDown();
            setTwo();
        } else {
            slideUp();
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;
    updateScore();
    updateHighscore(); // Check and update highscore    
    

    if (isGameOver()) {
        gameOver = true;
        showGameOver();
    }
}

// Prevent default scrolling on touch
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Optional: Also disable double-tap to zoom
document.body.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});


//Checks for gameover
function isGameOver() {
    // Check if there are empty tiles
    if (hasEmptyTile()) {
        return false;
    }

    // Check for possible merges
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] === board[r][c + 1]) {
                return false;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] === board[r + 1][c]) {
                return false;
            }
        }
    }

    return true;
}

function showGameOver() {
    // Check if the game over message already exists
    if (document.getElementById("game-over")) {
        return;
    }

    let gameOverDiv = document.createElement("div");
    gameOverDiv.id = "game-over";
    gameOverDiv.innerText = "Game Over!";
    document.getElementById("board").append(gameOverDiv);
}

function restartGame() {
    // Reset the board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Reset the score
    score = 0;
    updateScore();

    // Clear the board display
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }

    // Create two new tiles
    setTwo();
    setTwo();

     // Remove the Game Over message if it exists
    let gameOverMessage = document.getElementById("game-over");
    if (gameOverMessage) {
        gameOverMessage.remove();
    }

    // Reset the game over flag
    gameOver = false;
}
