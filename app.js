let gameSeq = [];
let userSeq = [];
let btns = ["red", "yellow", "green", "blue"];

let started = false;
let level = 0;
let highScore = 0;
let userTurn = false; // Prevents clicking during computer sequence

let maxScoreDisplay = document.querySelector("#maxScore");
let messageDisplay = document.querySelector("#highscore");
let startBtn = document.querySelector("#startBtn");
let allBtns = document.querySelectorAll(".box");
let body = document.querySelector("body");

// --- Modal Logic ---
const overlay = document.getElementById('instruction-overlay');
const closeBtn = document.querySelector('.close-btn');
const modalStartBtn = document.querySelector('#modal-start-btn');

function closeModal() {
    overlay.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);

modalStartBtn.addEventListener('click', function() {
    closeModal();
    if (!started) {
        startGame();
    }
});

// --- Game Logic ---

// Start Game via Main Button
startBtn.addEventListener("click", function() {
    if (started == false) {
        startGame();
    }
});

function startGame() {
    console.log("Game Started");
    started = true;
    level = 0;
    gameSeq = [];
    userSeq = [];
    startBtn.innerText = "Playing...";
    startBtn.style.pointerEvents = "none"; 
    startBtn.style.opacity = "0.6";
    updateLevel();
}

function updateLevel() {
    userSeq = [];
    level++;
    messageDisplay.innerText = `Level ${level}`;

    // Add new random color
    let randomIdx = Math.floor(Math.random() * 4);
    let randomColor = btns[randomIdx];
    gameSeq.push(randomColor);

    // Play the FULL sequence
    playSequence();
}

function playSequence() {
    userTurn = false; // Lock user input
    let i = 0;

    let intervalId = setInterval(() => {
        let color = gameSeq[i];
        let btn = document.querySelector(`.${color}`);
        gameFlash(btn);
        i++;

        if (i >= gameSeq.length) {
            clearInterval(intervalId);
            // Allow user to click after sequence finishes
            setTimeout(() => {
                userTurn = true;
            }, 500); 
        }
    }, 800); // 800ms speed between flashes
}

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 100);
}

function checkBtn(idx) {
    // Check if the current click matches the sequence at that index
    if (userSeq[idx] === gameSeq[idx]) {
        // If the user has finished the sequence for this level
        if (userSeq.length == gameSeq.length) {
            setTimeout(updateLevel, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    messageDisplay.innerHTML = `Game Over! Your Score: <b>${level - 1}</b>`;
    
    body.classList.add("game-over-flash");
    setTimeout(function() {
        body.classList.remove("game-over-flash");
    }, 250);

    if ((level - 1) > highScore) {
        highScore = level - 1;
        maxScoreDisplay.innerText = `HighScore : ${highScore}`;
    }

    reset();
}

function btnPress() {
    // Only allow click if game is started AND it is the user's turn
    if (!started || !userTurn) { 
        return; 
    }

    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkBtn(userSeq.length - 1);
}

// Add event listeners to colored boxes
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    userTurn = false;
    startBtn.innerText = "Restart Game";
    startBtn.style.pointerEvents = "all";
    startBtn.style.opacity = "1";
}