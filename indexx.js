document.addEventListener('DOMContentLoaded', function () {
    const highScoresHeader = document.getElementById('highScoresHeader');
    const highScoresList = document.getElementById('highscoresList');

    // Initially hide the high scores list
    highScoresList.style.display = 'none';

    // Toggle the visibility of the high scores list when the header is clicked
    highScoresHeader.addEventListener('click', function () {
        if (highScoresList.style.display === 'none') {
            highScoresList.style.display = 'block';
        } else {
            highScoresList.style.display = 'none';
        }
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
        window.location.href = 'new.html';
    }

    document.getElementById('playername1').innerText = name1;
    document.getElementById('playername2').innerText = name2;
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
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Make a GET request to fetch the high scores from the server
        const response = await fetch('http://localhost:3000/winners');

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