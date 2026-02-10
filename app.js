let gameSeq = [];
let userSeq = [];
let btns = ["red", "yellow", "green", "blue"];

let started = false;
let level = 0;
let highScore = 0;
let userTurn = false;

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
    // Add class for 3D pressed state
    startBtn.classList.add("playing");
    
    updateLevel();
}

function updateLevel() {
    userSeq = [];
    level++;
    messageDisplay.innerText = `Level ${level}`;

    let randomIdx = Math.floor(Math.random() * 4);
    let randomColor = btns[randomIdx];
    gameSeq.push(randomColor);

    playSequence();
}

function playSequence() {
    userTurn = false;

    // --- MODIFIED LOGIC: Only flash the newest color ---
    // Get the last color added to the array
    let lastColor = gameSeq[gameSeq.length - 1];
    let btn = document.querySelector(`.${lastColor}`);

    // Flash just that button
    gameFlash(btn);

    // Enable user input after the flash finishes + small buffer
    setTimeout(() => {
        userTurn = true;
    }, 500); 
}

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 200);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 100);
}

function checkBtn(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length) {
            setTimeout(updateLevel, 500);
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
    if (!started || !userTurn) { 
        return; 
    }

    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkBtn(userSeq.length - 1);
}

for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    userTurn = false;
    startBtn.innerText = "Start Game";
    startBtn.classList.remove("playing");
}