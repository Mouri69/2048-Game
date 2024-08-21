const board = document.getElementById('game-board');
const restartButton = document.getElementById('restart');
const size = 4;
const tiles = [];

// Initialize the game board
function init() {
    board.innerHTML = '';
    for (let i = 0; i < size; i++) {
        tiles[i] = [];
        for (let j = 0; j < size; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.top = `${i * 100}px`;
            tile.style.left = `${j * 100}px`;
            board.appendChild(tile);
            tiles[i][j] = 0;
        }
    }
    addRandomTile();
    addRandomTile();
    updateBoard();
}

// Add a random tile to the board
function addRandomTile() {
    let emptyTiles = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (tiles[i][j] === 0) emptyTiles.push([i, j]);
        }
    }
    if (emptyTiles.length > 0) {
        const [i, j] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        tiles[i][j] = Math.random() < 0.9 ? 2 : 4;
        console.log(`Added tile ${tiles[i][j]} at (${i}, ${j})`);
    }
}

// Update the board display
function updateBoard() {
    const tileElements = board.getElementsByClassName('tile');
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const value = tiles[i][j];
            const index = i * size + j;
            tileElements[index].textContent = value > 0 ? value : '';
            tileElements[index].className = `tile tile-${value}`;
        }
    }
    console.log('Board updated:', tiles);
}

// Helper function to slide and combine tiles in a row or column
function slideAndCombine(row) {
    console.log('Original row:', row);
    const newRow = row.filter(value => value > 0); // Remove zeros
    const mergedRow = [];
    let skip = false;

    for (let i = 0; i < newRow.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
            mergedRow.push(newRow[i] * 2);
            console.log(`Merging ${newRow[i]} with ${newRow[i + 1]}`);
            skip = true;
        } else {
            mergedRow.push(newRow[i]);
        }
    }
    while (mergedRow.length < size) {
        mergedRow.push(0);
    }
    console.log('New row after combining:', mergedRow);
    return mergedRow;
}

// Slide and merge tiles in a specific direction
function moveTiles(direction) {
    let moved = false;
    const previousTiles = tiles.map(row => row.slice());

    for (let i = 0; i < size; i++) {
        let row;
        switch (direction) {
            case 'left':
                row = tiles[i];
                break;
            case 'right':
                row = tiles[i].slice().reverse();
                break;
            case 'up':
                row = tiles.map(row => row[i]);
                break;
            case 'down':
                row = tiles.map(row => row[i]).reverse();
                break;
        }

        const newRow = slideAndCombine(row);

        switch (direction) {
            case 'left':
                tiles[i] = newRow;
                break;
            case 'right':
                tiles[i] = newRow.reverse();
                break;
            case 'up':
                for (let j = 0; j < size; j++) {
                    tiles[j][i] = newRow[j];
                }
                break;
            case 'down':
                for (let j = 0; j < size; j++) {
                    tiles[j][i] = newRow.reverse()[j];
                }
                break;
        }

        // Check if any change occurred
        if (JSON.stringify(previousTiles) !== JSON.stringify(tiles)) {
            moved = true;
            console.log(`Moved tiles ${direction}`);
        }
    }
    console.log('Tiles after move:', tiles);
    return moved;
}

// Check if the game is over
function isGameOver() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (tiles[i][j] === 0) return false;
            if (i < size - 1 && tiles[i][j] === tiles[i + 1][j]) return false;
            if (j < size - 1 && tiles[i][j] === tiles[i][j + 1]) return false;
        }
    }
    console.log('Game Over!');
    return true;
}

// Handle key presses for movement
function handleKey(e) {
    let moved = false;
    switch (e.key) {
        case 'ArrowUp':
            moved = moveTiles('up');
            break;
        case 'ArrowDown':
            moved = moveTiles('down');
            break;
        case 'ArrowLeft':
            moved = moveTiles('left');
            break;
        case 'ArrowRight':
            moved = moveTiles('right');
            break;
    }
    if (moved) {
        addRandomTile();
        updateBoard();
        if (isGameOver()) {
            alert('Game Over!');
        }
    }
}

// Event listeners
restartButton.addEventListener('click', init);
window.addEventListener('keydown', handleKey);

// Initialize the game
init();
