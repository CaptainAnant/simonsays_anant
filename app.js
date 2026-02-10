let gameSeq = [];
let userSeq = [];

let btns = ["red", "yellow", "green", "blue"];

let started = false;
let level = 0;
let highScore = 0;

let maxScoreDisplay = document.querySelector("#maxScore");
let messageDisplay = document.querySelector("#highscore");
let startBtn = document.querySelector("#startBtn");
let allBtns = document.querySelectorAll(".box");
let body = document.querySelector("body");

// Start Game via Button (For Mobile/Mouse)
startBtn.addEventListener("click", function() {
    if (started == false) {
        startGame();
    }
});

// Start Game via Keyboard (Desktop)
document.addEventListener("keydown", function() {
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
    // Disable button to prevent double clicks during game
    startBtn.style.pointerEvents = "none"; 
    startBtn.style.opacity = "0.6";
    updateLevel();
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

function updateLevel() {
    userSeq = [];
    level++;
    messageDisplay.innerText = `Level ${level}`;

    // Add a slight delay before the sequence plays so the user is ready
    setTimeout(() => {
        let randomIdx = Math.floor(Math.random() * 4);
        let randomColor = btns[randomIdx];
        let randomBtn = document.querySelector(`.${randomColor}`);
        gameSeq.push(randomColor);
        gameFlash(randomBtn);
    }, 500);
}

function checkBtn(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length) {
            setTimeout(updateLevel, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    messageDisplay.innerHTML = `Game Over! Your Score: <b>${level - 1}</b>`;
    
    // Visual Feedback
    body.classList.add("game-over-flash");
    setTimeout(function() {
        body.classList.remove("game-over-flash");
    }, 250);

    // Update High Score
    if ((level - 1) > highScore) {
        highScore = level - 1;
        maxScoreDisplay.innerText = `HighScore : ${highScore}`;
    }

    reset();
}

function btnPress() {
    // If game hasn't started, flash the button but don't add logic
    let btn = this;
    userFlash(btn);

    if (started == false) {
        // Optional: Shake the start button to remind them to click it
        return;
    }

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkBtn(userSeq.length - 1);
}

// Add event listeners to boxes
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    startBtn.innerText = "Restart Game";
    startBtn.style.pointerEvents = "all";
    startBtn.style.opacity = "1";
}