
const ipAddress = CONFIG.PUBLIC_IP;
let hasReachedExit = false; // Flag to track if the AI has reached the maze exit
function ree() {
    window.location.href = 'playingAI.html';
}
function reehome() {
    window.location.href = '/index.html';
}

var name2 = localStorage.getItem('name2').toUpperCase();
var name1 = localStorage.getItem('name1').toUpperCase();

document.getElementById('p1point').textContent = (name1 ? name1 + ': 100 points' : 'Player 2: 100 points');
document.getElementById('p2point').textContent = (name2 ? name2 + ': 100 points' : 'Player 1: 100 points');


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

const FREE_ZONE_HEIGHT = 10000; // Additional rows for the free zone
const TOTAL_HEIGHT = MAZE_HEIGHT + FREE_ZONE_HEIGHT;

function generateMaze() {
    // Initialize the maze grid with the free zone
    maze = [];
    for (let i = 0; i < TOTAL_HEIGHT; i++) {
        maze[i] = [];
        for (let j = 0; j < MAZE_WIDTH; j++) {
            if (i < MAZE_HEIGHT) {
                maze[i][j] = 1; // Fill the original maze with walls
            } else {
                maze[i][j] = 0; // Fill the free zone with empty paths
            }
        }
    }

    // Create a starting point
    const start = { x: 0, y: 0 };
    maze[start.y][start.x] = 0; // Mark the starting point as a path

    // Recursively carve the maze
    carveMaze(start.x, start.y);

    // Ensure there is an exit on the bottom row of the maze
    const bottomRow = MAZE_HEIGHT - 1;
    for (let x = 0; x < MAZE_WIDTH; x++) {
        if (maze[bottomRow][x] === 0) {
            break; // Exit already exists
        }
        if (x === MAZE_WIDTH - 1) {
            // No exit found, create one
            maze[bottomRow][x] = 0; // Open the bottom-right cell
        }
    }

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
        return x >= 0 && x < MAZE_WIDTH && y >= 0 && y < TOTAL_HEIGHT && maze[y][x] === 1;
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


let MAZE_EXIT; // Declare MAZE_EXIT as a global variable


function initializeGame() {
    generateMaze();

    // Initialize player positions
    player2 = { x: 0, y: 0 };
    player1 = { x: MAZE_WIDTH - 1, y: 0 };

    // Initialize time left
    timeLeft = 55000; // 3 minutes in milliseconds

    // Find and log the maze exit
    MAZE_EXIT = findMazeExit();
    console.log(`Maze exit position: (${MAZE_EXIT.x}, ${MAZE_EXIT.y})`);

    // Initialize planet positions
    PLANET1 = { x: Math.floor(imageX / CELL_SIZE), y: MAZE_HEIGHT + 1 }; // Below the maze
    PLANET2 = { x: Math.floor(image2X / CELL_SIZE), y: MAZE_HEIGHT + 2 }; // Below the maze

    console.log(`Planet 1 position: (${PLANET1.x}, ${PLANET1.y})`);
    console.log(`Planet 2 position: (${PLANET2.x}, ${PLANET2.y})`);
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

    // // Draw debug markers for planet positions
    // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red marker for Planet 1
    // ctx.fillRect(PLANET1.x * CELL_SIZE, PLANET1.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; // Blue marker for Planet 2
    // ctx.fillRect(PLANET2.x * CELL_SIZE, PLANET2.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Draw timer
    const timerDiv = document.getElementById('timer');
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    timerDiv.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Draw coins
    ctx.fillStyle = '#8FC1FF';
    goodCoins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x * CELL_SIZE + CELL_SIZE / 2, coin.y * CELL_SIZE + CELL_SIZE / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

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


    // Update planet positions
    PLANET1 = { x: Math.floor(imageX / CELL_SIZE), y: Math.floor(imageY / CELL_SIZE) };
    PLANET2 = { x: Math.floor(image2X / CELL_SIZE), y: Math.floor(image2Y / CELL_SIZE) };


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

// Add a delay to slow down AI movement
let lastAIMoveTime = 0;
const AIMoveDelay = 100; // Delay in milliseconds (adjust as needed)

// Helper function to find the shortest path using Breadth-First Search (BFS)
function findShortestPath(start, end, maze) {
    const queue = [{ x: start.x, y: start.y, path: [] }];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();

        // Check if the current position is the end
        if (x === end.x && y === end.y) {
            return path; // Return the path to the end position
        }

        // Explore all four directions
        const directions = [
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 },  // Right
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 }   // Down
        ];

        for (const dir of directions) {
            const newX = x + dir.x;
            const newY = y + dir.y;

            // Check if the new position is within bounds and not visited
            if (
                newX >= 0 && newX < MAZE_WIDTH &&
                newY >= 0 && newY < TOTAL_HEIGHT && // Use TOTAL_HEIGHT instead of MAZE_HEIGHT
                maze[newY][newX] === 0 &&
                !visited.has(`${newX},${newY}`)
            ) {
                visited.add(`${newX},${newY}`);
                queue.push({ x: newX, y: newY, path: [...path, { x: newX, y: newY }] });
            }
        }
    }

    return null; // No path found
}

function moveAITowardTarget(target) {
    const path = findShortestPath({ x: player2.x, y: player2.y }, target, maze);
    if (path && path.length > 0) {
        const nextStep = path[0]; // Move to the first step in the path

        // Ensure the next step is valid
        if (maze[nextStep.y][nextStep.x] === 0) {
            player2.x = nextStep.x;
            player2.y = nextStep.y;
            console.log(`AI moving to: (${nextStep.x}, ${nextStep.y})`);
        } else {
            console.log(`AI stuck at: (${player2.x}, ${player2.y}) - invalid path`);
        }
    } else {
        console.log(`No path found to target: (${target.x}, ${target.y})`);
    }
}

function moveAITowardCoin() {
    if (goodCoins.length > 0 || badCoins.length > 0) {
        const allCoins = goodCoins.concat(badCoins);
        let nearestCoin = allCoins[0];
        let minDistance = Infinity;

        // Find the nearest coin
        for (const coin of allCoins) {
            const distance = Math.abs(player2.x - coin.x) + Math.abs(player2.y - coin.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCoin = coin;
            }
        }

        // Move toward the nearest coin
        console.log(`AI targeting coin at: (${nearestCoin.x}, ${nearestCoin.y})`);
        moveAITowardTarget(nearestCoin);
    } else {
        console.log("No coins left to collect");
    }
}


function findMazeExit() {
    // Scan the bottom row for an exit
    const bottomRow = MAZE_HEIGHT - 1;
    for (let x = 0; x < MAZE_WIDTH; x++) {
        if (maze[bottomRow][x] === 0) {
            return { x: x, y: bottomRow }; // Return the first accessible cell on the bottom row
        }
    }

    // If no exit is found on the bottom row, scan other boundaries (left, right, top)
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        if (maze[y][0] === 0) { // Left boundary
            return { x: 0, y: y };
        }
        if (maze[y][MAZE_WIDTH - 1] === 0) { // Right boundary
            return { x: MAZE_WIDTH - 1, y: y };
        }
    }

    // If no exit is found, check both bottom-left and bottom-right corners simultaneously
    const bottomLeftAccessible = maze[bottomRow][0] === 0; // Bottom-left corner
    const bottomRightAccessible = maze[bottomRow][MAZE_WIDTH - 1] === 0; // Bottom-right corner

    if (bottomLeftAccessible && bottomRightAccessible) {
        // If both corners are accessible, prioritize one (e.g., bottom-left)
        return { x: 0, y: bottomRow };
    } else if (bottomLeftAccessible) {
        // If only the bottom-left corner is accessible
        return { x: 0, y: bottomRow };
    } else if (bottomRightAccessible) {
        // If only the bottom-right corner is accessible
        return { x: MAZE_WIDTH - 1, y: bottomRow };
    }

    // If neither corner is accessible, default to the bottom-right corner
    return { x: MAZE_WIDTH - 1, y: bottomRow };
}


function isAtPosition(player, target, tolerance = 1) {
    return (
        Math.abs(player.x - target.x) <= tolerance &&
        Math.abs(player.y - target.y) <= tolerance
    );
}



function getAdjustedPlanetPosition(planet, offsetX, offsetY) {
    let adjustedX = planet.x + offsetX;
    let adjustedY = planet.y + offsetY;

    // Ensure the adjusted position is within the maze bounds
    if (adjustedX >= MAZE_WIDTH) {
        adjustedX = MAZE_WIDTH - 1; // Clamp to the right edge of the maze
    }
    if (adjustedY >= TOTAL_HEIGHT) {
        adjustedY = TOTAL_HEIGHT - 1; // Clamp to the bottom of the maze
    }
    return { x: adjustedX, y: adjustedY };
}



// Function to move the AI toward both planets when 10 seconds remain
// Function to move the AI toward the maze exit and then toward the planets
let aiState = "collectingCoins"; // Possible states: "collectingCoins", "movingToPlanet1", "movingToPlanet2"

function moveAITowardPlanets() {
    if (!hasReachedExit) {
        // Move toward the maze exit first
        console.log("AI moving toward maze exit");
        const path = findShortestPath({ x: player2.x, y: player2.y }, MAZE_EXIT, maze);
        if (path) {
            moveAITowardTarget(MAZE_EXIT);
        } else {
            console.log("No path found to maze exit");
        }

        // Check if the AI has reached the exit
        if (isAtPosition(player2, MAZE_EXIT)) {
            hasReachedExit = true;
            aiState = "movingToPlanet1"; // Transition to moving toward Planet 1
            console.log("AI reached maze exit. Moving toward Planet 1");
        }
    } else {
        // Move toward planets after reaching the exit
        if (aiState === "movingToPlanet1") {
            const targetPlanet1 = getAdjustedPlanetPosition(PLANET1, 2, 2); // 5 points right and 50 points below Planet 1
            console.log(`AI moving toward Planet 1 (adjusted position: ${targetPlanet1.x}, ${targetPlanet1.y})`);
            const path = findShortestPath({ x: player2.x, y: player2.y }, targetPlanet1, maze);
            if (path) {
                moveAITowardTarget(targetPlanet1);
            } else {
                console.log("No path found to Planet 1 (adjusted position)");
            }

            // Check if the AI has reached the adjusted position for Planet 1
            if (isAtPosition(player2, targetPlanet1)) {
                aiState = "movingToPlanet2"; // Transition to moving toward Planet 2
                console.log("AI reached adjusted position for Planet 1. Moving toward Planet 2");
            }
        } else if (aiState === "movingToPlanet2") {
            const targetPlanet2 = getAdjustedPlanetPosition(PLANET2,2,2 ); // 5 points right and 50 points below Planet 2
            console.log(`AI moving toward Planet 2 (adjusted position: ${targetPlanet2.x}, ${targetPlanet2.y})`);
            const path = findShortestPath({ x: player2.x, y: player2.y }, targetPlanet2, maze);
            if (path) {
                moveAITowardTarget(targetPlanet2);
            } else {
                console.log("No path found to Planet 2 (adjusted position)");
            }

            // Check if the AI has reached the adjusted position for Planet 2
            if (isAtPosition(player2, targetPlanet2)) {
                aiState = "done"; // AI has reached both planets
                console.log("AI reached adjusted position for Planet 2. Mission complete.");
                resetAIForCoinCollection(); // Reset AI state to collect coins again
            }
        }
    }

}

function resetAIForCoinCollection() {
    aiState = "collectingCoins"; // Reset AI state to collect coins
    hasReachedExit = false; // Reset exit flag
    console.log("AI reset to collect coins again.");
}


// Modify the game loop to include AI behavior
function gameLoop() {
    updateGame(canvas);
    drawGame();

    // AI behavior
    const currentTime = Date.now();
    if (currentTime - lastAIMoveTime > AIMoveDelay) {
        if (timeLeft > 30000) {
            // Collect coins during the game
            console.log("AI collecting coins");
            moveAITowardCoin();
        } else {
            // Move toward planets when 10 seconds remain
            console.log("AI moving toward planets (final rush)");
            moveAITowardPlanets();
        }
        lastAIMoveTime = currentTime; // Update the last move time
    }

    // Update timer
    timeLeft -= 10; // Decrease time by 10 milliseconds

    // Check for game end conditions
    if (timeLeft <= 0) {
        gameRunning = false; // Stop the game loop
        endGame(); // Call the endGame function
    }

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
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