
const ipAddress = CONFIG.PUBLIC_IP;
function ree() {
    window.location.href = 'index.html';
}
function reehome() {
    window.location.href = '/index.html';
}

var name1 = localStorage.getItem('name1').toUpperCase();
var name2 = localStorage.getItem('name2').toUpperCase();

document.getElementById('p2point').textContent = (name2 ? name2 + ': 100 points' : 'Player 2: 100 points');
document.getElementById('p1point').textContent = (name1 ? name1 + ': 100 points' : 'Player 1: 100 points');


function startGame() {
    document.querySelector('.start-page').style.display = 'none';
    initializeGame();
    gameLoop();
}
const canvas = document.getElementById('mazeCanvas');
const canvasHeight = canvas.height;
console.log(canvasHeight)

let image2X, image2Y; // Declare image2X and image2Y globally
let imageWidth2 = 100; // Set the initial width of the image
let imageHeight2 = 100; // Set the initial height of the image
let collisionOccurred2 = false; // Flag to track if collision has occurred

window.onload = function () {
    // Define variables for the game state
    let maze, player1, player2, timeLeft;
    let imageWidth = 100; // Set the initial width of the image
    let imageHeight = 100; // Set the initial height of the image
    let imageX, imageY;
    let collisionOccurred = false; // Flag to track if collision has occurred

    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    resizeCanvas();

    // Function to resize canvas when the window is resized
    window.addEventListener('resize', resizeCanvas);

    function resizeCanvas() {
        canvas.width = MAZE_WIDTH * CELL_SIZE;
        canvas.height = (window.innerHeight);
        // Recalculate cell size based on canvas size
        CELL_SIZE = Math.min(canvas.width / MAZE_WIDTH, canvas.height / MAZE_HEIGHT);
        // Call drawGame or any other drawing function here to redraw the canvas content if needed
    }

    // Your drawing and game logic here...
};

// Define constants for the game
const MAZE_WIDTH = 55;
const MAZE_HEIGHT = 15;
// let CELL_SIZE = (Math.max(Math.floor(window.innerWidth / MAZE_WIDTH), Math.floor(window.innerHeight / MAZE_HEIGHT)) - 1) * 0.7;
let CELL_SIZE = 31;

const PLAYER_RADIUS = 10;

// Define variables for the game state
let maze, player1, player2, timeLeft;
let imageWidth = 100; // Set the initial width of the image
let imageHeight = 100; // Set the initial height of the image
let imageX, imageY;
let collisionOccurred = false; // Flag to track if collision has occurred

function generateMaze() {
    // Calculate the new maze height with 30% extra space
    const extendedHeight = Math.ceil(MAZE_HEIGHT * 2);

    // Initialize the maze grid
    maze = [];
    for (let i = 0; i < extendedHeight; i++) {
        maze[i] = [];
        for (let j = 0; j < MAZE_WIDTH; j++) {
            if (i < MAZE_HEIGHT) {
                maze[i][j] = 1; // Fill the original maze with walls
            } else {
                maze[i][j] = 0; // Fill the extra space with empty paths
            }
        }
    }

    // Create a starting point
    const start = { x: 0, y: 0 };
    maze[start.y][start.x] = 0; // Mark the starting point as a path

    // Recursively carve the maze
    carveMaze(start.x, start.y);

    // Define end point
    maze[MAZE_HEIGHT - 1][MAZE_WIDTH - 1] = 0; // End point

    function carveMaze(x, y) {
        const directions = shuffleDirections(); // Randomize the order of directions

        for (const dir of directions) {
            const newX = x + dir.x * 2;
            const newY = y + dir.y * 2;

            if (isValid(newX, newY)) {
                maze[y + dir.y][x + dir.x] = 0; // Carve a path
                maze[newY][newX] = 0; // Carve a path
                carveMaze(newX, newY);
            }
        }
    }

    // Check if the coordinates are valid within the extended maze bounds
    function isValid(x, y) {
        return x >= 0 && x < MAZE_WIDTH && y >= 0 && y < extendedHeight && maze[y][x] === 1;
    }

    // Shuffle directions to create randomness in the maze generation
    function shuffleDirections() {
        const directions = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }]; // Up, right, down, left
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        return directions;
    }

    startCoinGeneration();
}




// Function to generate random coins one by one on empty cells of the maze
function startCoinGeneration() {
    // Set interval to generate coins
    setInterval(generateRandomCoins, 15); // Adjust the interval as needed (5000 milliseconds = 5 seconds)
}

let goodCoins = [];
let badCoins = [];


// Function to generate random coins one by one on empty cells of the maze
function generateRandomCoins() {
    // Generate random coordinates until an empty cell is found
    let emptyCellFound = false;
    let x, y;
    while (!emptyCellFound) {
        x = Math.floor(Math.random() * MAZE_WIDTH);
        y = Math.floor(Math.random() * MAZE_HEIGHT);
        if (maze[y][x] === 0) { // Check if the cell is empty
            emptyCellFound = true;
        }
    }

    // Determine whether to add a good coin, a bad coin, or no coin
    if (Math.random() < 0.03) { // Adjust the probability as needed
        goodCoins.push({ x: x, y: y });
    }
    if (Math.random() < 0.02) { // Adjust the probability as needed
        badCoins.push({ x: x, y: y });
    }
}

// Call generateRandomCoins function periodically
setInterval(generateRandomCoins, 5000); // Adjust the interval as needed (5000 milliseconds = 5 seconds)


// Function to initialize game state
function initializeGame() {
    generateMaze();

    // Initialize player positions
    player2 = { x: 0, y: 0 };
    player1 = { x: MAZE_WIDTH - 1, y: 0 };



    // Initialize time left
    timeLeft = 55000; // 3 minutes in milliseconds
}

const image = new Image();
image.onload = function () {
    console.log('Image 1 loaded successfully.');
    drawGame(); // Draw the game once the image is loaded
};
image.src = '../Media/fplanet1.png'; // Replace 'planet1final.png' with the correct path to your image file

const image2 = new Image();
image2.onload = function () {
    console.log('Image 2 loaded successfully.');
    drawGame(); // Draw the game once the image is loaded
};
image2.src = '../Media/fplanet2.png'; // Replace 'planet2final.png' with the correct path to your second image file
// Function to draw the game
function drawGame() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    for (let i = 0; i < MAZE_HEIGHT; i++) {
        for (let j = 0; j < MAZE_WIDTH; j++) {
            ctx.fillStyle = 'gold';
            if (maze[i][j] === 1) {
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE); // Draw wall
            }
        }
    }

    // Draw players
    ctx.beginPath();
    ctx.arc(player1.x * CELL_SIZE + CELL_SIZE / 2, player1.y * CELL_SIZE + CELL_SIZE / 2, PLAYER_RADIUS * (CELL_SIZE / 30), 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(player2.x * CELL_SIZE + CELL_SIZE / 2, player2.y * CELL_SIZE + CELL_SIZE / 2, PLAYER_RADIUS * (CELL_SIZE / 30), 0, Math.PI * 2);
    ctx.fillStyle = 'lightgrey';
    ctx.fill();
    ctx.closePath();

    // Set the initial position of the image
    imageX = (canvas.width - imageWidth) / 1.02;
    imageY = canvas.height - imageHeight - 70;

    image2X = (canvas.width - imageWidth2) / 40;
    image2Y = canvas.height - imageHeight2 - 70;

    // Draw the image onto the canvas
    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight); // Set destination width and height to 100 pixels

    // Draw the second image onto the canvas at the bottom-left corner
    ctx.drawImage(image2, image2X, image2Y, imageWidth2, imageHeight2);

    // Draw timer
    const timerDiv = document.getElementById('timer');
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    timerDiv.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    ctx.fillStyle = '#8FC1FF';
    goodCoins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x * CELL_SIZE + CELL_SIZE / 2, coin.y * CELL_SIZE + CELL_SIZE / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

    // Draw bad coins
    ctx.fillStyle = 'rgb(195,91,255)';
    badCoins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x * CELL_SIZE + CELL_SIZE / 2, coin.y * CELL_SIZE + CELL_SIZE / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

let p1gpoints = 0;
let p1bpoints = 0;

let p2gpoints = 0;
let p2bpoints = 0;

// Function to update game state
function updateGame(canvas) {

    // Update timer
    timeLeft -= 10; // Decrease time by 10 milliseconds

    // Check for game end conditions
    if (timeLeft <= 0) {
        endGame();
    }

    // Collision detection between player and image
    const player1CollidesImage1 = checkCollision(player1, imageX, imageY, imageWidth, imageHeight);
    const player2CollidesImage1 = checkCollision(player2, imageX, imageY, imageWidth, imageHeight);
    const player1CollidesImage2 = checkCollision(player1, image2X, image2Y, imageWidth2, imageHeight2);
    const player2CollidesImage2 = checkCollision(player2, image2X, image2Y, imageWidth2, imageHeight2);

    // Check collision with planet 1 player1
    if (player1CollidesImage1) {
        // Increase size of image1
        if (!collisionOccurred) {
            imageWidth += p1gpoints;
            imageHeight += p1gpoints;
            imageX = (canvas.width - imageWidth) / 2;
            imageY = canvas.height - imageHeight;
            collisionOccurred = true;
            p1gpoints = 0;
            document.getElementById('p1point').textContent = name1 ? name1 + ':' + imageHeight + "points" : "Player 1:" + imageHeight + "points";

        }
    }

    else if (player1CollidesImage2) {
        // Increase size of image1
        if (!collisionOccurred) {
            imageWidth2 -= p1bpoints;
            imageHeight2 -= p1bpoints;
            imageX = (canvas.width - imageWidth) / 2;
            imageY = canvas.height - imageHeight;
            collisionOccurred = true;
            p1bpoints = 0;
            document.getElementById('p2point').textContent = name2 ? name2 + ':' + imageHeight2 + "points" : "Player 2:" + imageHeight2 + "points";



        }
    }
    else if (player2CollidesImage2) {
        // Increase size of image1
        if (!collisionOccurred) {
            imageWidth2 += p2gpoints;
            imageHeight2 += p2gpoints;
            imageX = (canvas.width - imageWidth) / 2;
            imageY = canvas.height - imageHeight;
            collisionOccurred = true;
            p2gpoints = 0;
            document.getElementById('p2point').textContent = name2 ? name2 + ':' + imageHeight2 + "points" : "Player 2:" + imageHeight2 + "points";

        }
    }
    else if (player2CollidesImage1) {
        // Increase size of image1
        if (!collisionOccurred) {
            imageWidth -= p2bpoints;
            imageHeight -= p2bpoints;
            imageX = (canvas.width - imageWidth) / 2;
            imageY = canvas.height - imageHeight;
            collisionOccurred = true;
            p2bpoints = 0;
            document.getElementById('p1point').textContent = name1 ? name1 + ':' + imageHeight + "points" : "Player 1:" + imageHeight + "points";
        }

    }

    // Check collision with coins
    else {
        // Check collision with good coins
        goodCoins.forEach((coin, index) => {
            if (player1.x === coin.x && player1.y === coin.y) {
                goodCoins.splice(index, 1); // Remove the collected coin from the array
                p1gpoints++;
                // Increase player 1's points for collecting good coins
                console.log("Player1 gpoints" + p1gpoints)
            }
            if (player2.x === coin.x && player2.y === coin.y) {
                goodCoins.splice(index, 1); // Remove the collected coin from the array
                p2gpoints++;
                // Increase player 2's points for collecting good coins
                console.log("Player2 gpoints" + p2gpoints)
            }
        });

        // Check collision with bad coins
        badCoins.forEach((coin, index) => {
            if (player1.x === coin.x && player1.y === coin.y) {
                badCoins.splice(index, 1); // Remove the collected coin from the array
                p1bpoints++;
                // Increase player 1's points for collecting good coins
                console.log("Player1 bpoints" + p1bpoints)
                // Decrease player 1's points for collecting bad coins
            }
            if (player2.x === coin.x && player2.y === coin.y) {
                badCoins.splice(index, 1); // Remove the collected coin from the array
                p2bpoints++;
                // Increase player 1's points for collecting good coins
                console.log("Player1 gpoints" + p1gpoints)
                // Decrease player 2's points for collecting bad coins
            }
        });

        // Reset collision flag if no collision occurred
        collisionOccurred = false;
        collisionOccurred2 = false;

        document.getElementById('p1gcoins').innerText = p1gpoints;
        document.getElementById('p1bcoins').innerText = p1bpoints;
        document.getElementById('p2gcoins').innerText = p2gpoints;
        document.getElementById('p2bcoins').innerText = p2bpoints;
    }
}

// Function to check collision between player and image
function checkCollision(player, imageX, imageY, imageWidth, imageHeight) {
    const playerX = player.x * CELL_SIZE + CELL_SIZE / 2;
    const playerY = player.y * CELL_SIZE + CELL_SIZE / 2;

    return (
        playerX + PLAYER_RADIUS > imageX &&
        playerX - PLAYER_RADIUS < imageX + imageWidth &&
        playerY + PLAYER_RADIUS > imageY &&
        playerY - PLAYER_RADIUS < imageY + imageHeight
    );
}

// Function to end the game
function endGame() {
    const winnerOuter = document.querySelector('.winnerouter');
    if (winnerOuter) {
        winnerOuter.style.display = 'block';
    }

    // Determine the winner based on house sizes
    // Display winner or tie message
    finalpoints1 = imageHeight;
    finalpoints2 = imageHeight2;

    let winnerImageHTML = '';
    let winnerName = '';
    let winnerScore = 0;

    if (finalpoints1 > finalpoints2) {
        winnerImageHTML = '<div class="winnerimg"><img src="../Media/win1.gif"></div>';
        winnerName = localStorage.getItem('name1');
        winnerScore = finalpoints1;
    } else if (imageHeight === 0) {
        winnerImageHTML = '<div class="winnerimg"><img src="../Media/win2.gif"></div>';
        winnerName = localStorage.getItem('name2');
        winnerScore = finalpoints2;
        gameRunning = false;
    }
    else if (imageHeight2 === 0) {
        winnerImageHTML = '<div class="winnerimg"><img src="../Media/win1.gif"></div>';
        winnerName = localStorage.getItem('name1');
        winnerScore = finalpoints1;
        gameRunning = false;

    }
    else {
        winnerImageHTML = '<div class="winnerimg"><img src="../Media/win2.gif"></div>';
        winnerName = localStorage.getItem('name2');
        winnerScore = finalpoints2;
    }

    // Update the winner's image
    document.querySelector('.winnerimg').innerHTML = winnerImageHTML;
    // Update the winner's name and score
    document.getElementById('winname').textContent = `Winner: ${winnerName}`;
    document.querySelector('.winner h2:last-of-type').textContent = `Score: ${winnerScore}`;

    // Send winner's name and score to the server
    saveWinnerToDatabase(winnerName, winnerScore);
}
// Function to save winner's data to the database
function saveWinnerToDatabase(winnerName, winnerScore) {
    const data = {
        name: winnerName,
        score: winnerScore
    };

    fetch(`http://${ipAddress}:3000/saveWinner`, {
        method: 'POST', // Ensure this is a POST request
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                console.log('Winner data sent to the server successfully.');
            } else {
                console.error('Failed to send winner data to the server.');
            }
        })
        .catch(error => {
            console.error('Error sending winner data to the server:', error);
        });
}


// Main game loop
let gameRunning = true; // Flag to track if the game is running

function gameLoop() {
    const canvas = document.getElementById('mazeCanvas');
    updateGame(canvas);
    drawGame();



    if (timeLeft > 0 && gameRunning) {
        requestAnimationFrame(gameLoop);
    }

    else {
        gameRunning = false; // Set the gameRunning flag to false to stop the loop
        endGame(); // Call the endGame function when the time ends
    }
}


// Initialize the game
initializeGame();

// Start the game loop
gameLoop();

// Event listeners for keyboard input, one for each player
document.addEventListener('keydown', function (event) {
    handlePlayer1Input(event);
    handlePlayer2Input(event);
});

// Function to handle player input for Player 1
function handlePlayer1Input(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            if (player1.x > 0 && maze[player1.y][player1.x - 1] === 0) {
                player1.x--;
                if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
        case 38: // Up arrow
            if (player1.y > 0 && maze[player1.y - 1][player1.x] === 0) {
                player1.y--;
                if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
        case 39: // Right arrow
            if (player1.x < MAZE_WIDTH - 1 && maze[player1.y][player1.x + 1] === 0) {
                player1.x++;
                if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
        case 40: // Down arrow
            if (player1.y < canvas.height / CELL_SIZE - 2 && maze[player1.y + 1][player1.x] === 0) {
                player1.y++;
                
                if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
    }
}

// Function to handle player input for Player 2
function handlePlayer2Input(event) {
    switch (event.keyCode) {
        case 65: // A key
            if (player2.x > 0 && maze[player2.y][player2.x - 1] === 0) {
                player2.x--;
                 if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
        case 87: // W key
            if (player2.y > 0 && maze[player2.y - 1][player2.x] === 0) {
                player2.y--;
                 if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
        case 68: // D key
            if (player2.x < MAZE_WIDTH - 1 && maze[player2.y][player2.x + 1] === 0) {
                player2.x++;
                 if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
        case 83: // S key
            if (player2.y < canvas.height / CELL_SIZE - 2 && maze[player2.y + 1][player2.x] === 0) {
                player2.y++;
                 if (imageHeight <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends
                }
                else if (imageHeight2 <= 0) {

                    gameRunning = false; // Set the gameRunning flag to false to stop the loop
                    endGame(); // Call the endGame function when the time ends

                }
            }
            break;
    }
}
