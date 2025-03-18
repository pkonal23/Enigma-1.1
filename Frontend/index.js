
const ipAddress = (typeof CONFIG !== 'undefined' && CONFIG.PUBLIC_IP) ? CONFIG.PUBLIC_IP : 'default.ip.address';

document.addEventListener('scriptsLoaded', function () {
    function isMobileOrTablet() {
        return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) ||
            (window.matchMedia && window.matchMedia("(max-width: 1024px)").matches);
    }

    if (isMobileOrTablet()) {
        // Check if the user has already been redirected in this session
        if (!sessionStorage.getItem('redirected')) {
            sessionStorage.setItem('redirected', 'true');
            window.location.href = '/Frontend/sorryDevice.html';
        }
        return; // Prevent further script execution
    }

    const highScoresHeader = document.getElementById('highScoresHeader');
    const highScoresList = document.getElementById('highscoresList');

    highScoresList.style.display = 'none';

    highScoresHeader.addEventListener('click', function () {
        highScoresList.style.display = highScoresList.style.display === 'none' ? 'block' : 'none';
    });
});



function start() {
    let name1 = document.getElementById('name1').value;
    let name2 = document.getElementById('name2').value;

    localStorage.setItem('name1', name1);
    localStorage.setItem('name2', name2);

    if (!name1 || !name2) {
        document.querySelector('.entername').innerHTML = "<p class='entername'>!Enter names to start</p>";
        name1 = 'Player 1';
        name2 = 'Player 2';
    }
    else {

        document.body.innerHTML += `<div id="loading" class="loading">Starting Game...</div>`;
        updateMessage();

        setTimeout(() => {
            window.location.href = '/Frontend/playing.html';
        }, 4000);



    }

    document.getElementById('playername1').innerText = name1;
    document.getElementById('playername2').innerText = name2;
}



const messages = ["Hold on...", "Setting up things...", "Starting game..."];
let index = 0;

function updateMessage() {
    if (index < messages.length) {
        document.getElementById("loading").innerText = messages[index];
        index++;
        setTimeout(updateMessage, 1500); // Change text every 3 seconds
    }
}




function startAI() {
    const aiNames = ["Neo", "Titan", "Eclipse", "Zenith", "Quantum", "Nimbus", "Spectre", "Aegis", "Orion", "Echo"];
    let name1Input = document.getElementById('name2');
    let name2Input = document.getElementById('name1');

    // Only generate AI name if name1 is empty
    if (!name1Input.value.trim()) {
        name1Input.value = aiNames[Math.floor(Math.random() * aiNames.length)];
        document.getElementById('playername1').innerText = name1Input.value;
    }


    let name2 = name1Input.value;
    let name1 = name2Input.value.trim();

    localStorage.setItem('name1', name1);
    localStorage.setItem('name2', name2);

    if (!name1) {
        document.querySelector('.entername').innerHTML = "<p class='entername'>!Enter your name to start</p>";
        name2Input.placeholder = 'Enter your name';
        return;
    }

    // Show loading animation

    document.body.innerHTML += `<div id="loading" class="loading">Starting Game...</div>`;
    updateMessage();

    setTimeout(() => {
        window.location.href = '/Frontend/playingAI.html';
    }, 4000);





    
    document.getElementById('playername1').innerText = name2;
    document.getElementById('playername2').innerText = name1;
}





function toggleSound() {
    var audio = document.getElementById("backgroundMusic");
    var originalIcon = document.getElementById("originalIcon");
    var newIcon = document.getElementById("newIcon");

    if (audio.paused) {
        audio.play();
        originalIcon.style.display = "block";
        newIcon.style.display = "none";
    } else {
        audio.pause();
        originalIcon.style.display = "none";
        newIcon.style.display = "block";
    }
}

function openinstruc() {
    var popit = document.getElementsByClassName('popup')[0]; // Access the first element in the collection

    if (popit && popit.style.display === 'block') { // Check if any elements were found and if the display is 'block'
        // Toggle the display of the popup
        popit.style.display = 'none';
    } else if (popit) { // Check if any elements were found
        // Toggle the display of the popup
        popit.style.display = 'block';
    }
}
document.addEventListener('scriptsLoaded', async function () {
    try {
        // Make a GET request to fetch the high scores from the server
        const response = await fetch(`http://${ipAddress}:3000/winners`);

        // Check if the response is successful (status code 200)
        if (response.ok) {
            // Parse the JSON response
            const highScores = await response.json();

            // Get the <ol> element by its id
            const ol = document.getElementById('highscoresList');

            // Clear any existing list items
            ol.innerHTML = '';

            // Iterate over each high score and add it to the list
            highScores.forEach(score => {
                // Create a new list item element
                const li = document.createElement('li');
                // Set the text content of the list item to display the name and score
                li.textContent = `${score.name} : ${score.score}pts`;
                // Append the list item to the <ol> element
                ol.appendChild(li);
            });
        } else {
            console.error('Failed to fetch high scores:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching high scores:', error);
    }
});