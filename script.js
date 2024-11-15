let score = 0;
let gold = 0;
let clickValue = 1;
let autoClickerValue = 0;
let timeLeft = 10 * 24 * 60 * 60; // 10 днів у секундах
let currentUser = null;

const scoreElement = document.getElementById('score');
const goldElement = document.getElementById('gold');
const timerElement = document.getElementById('timer');
const clickButton = document.getElementById('clickButton');
const upgradeClickButton = document.getElementById('upgradeClick');
const upgradeAutoButton = document.getElementById('upgradeAuto');
const loginSection = document.getElementById('loginSection');
const gameSection = document.getElementById('gameSection');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('loginButton');

function updateDisplay() {
    scoreElement.textContent = score;
    goldElement.textContent = gold;
    upgradeClickButton.textContent = `Покращити клік (${10 * clickValue} монет)`;
    upgradeAutoButton.textContent = `Авто-клікер (${50 * (autoClickerValue + 1)} монет)`;
    upgradeClickButton.disabled = score < 10 * clickValue;
    upgradeAutoButton.disabled = score < 50 * (autoClickerValue + 1);
}

function updateTimer() {
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function convertToGold() {
    const newGold = Math.floor(score / 100000);
    gold += newGold;
    score = 0;
    updateDisplay();
    saveGame();
}

function saveGame() {
    const gameData = {
        score,
        gold,
        clickValue,
        autoClickerValue,
        timeLeft
    };
    localStorage.setItem(currentUser, JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem(currentUser);
    if (savedData) {
        const gameData = JSON.parse(savedData);
        score = gameData.score || 0;
        gold = gameData.gold || 0;
        clickValue = gameData.clickValue || 1;
        autoClickerValue = gameData.autoClickerValue || 0;
        timeLeft = gameData.timeLeft || 10 * 24 * 60 * 60;
    } else {
        score = 0;
        gold = 0;
        clickValue = 1;
        autoClickerValue = 0;
        timeLeft = 10 * 24 * 60 * 60;
    }
    updateDisplay();
    updateTimer();
}

clickButton.addEventListener('click', () => {
    score += clickValue;
    updateDisplay();
});

upgradeClickButton.addEventListener('click', () => {
    if (score >= 10 * clickValue) {
        score -= 10 * clickValue;
        clickValue++;
        updateDisplay();
    }
});

upgradeAutoButton.addEventListener('click', () => {
    if (score >= 50 * (autoClickerValue + 1)) {
        score -= 50 * (autoClickerValue + 1);
        autoClickerValue++;
        updateDisplay();
    }
});

loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        loginSection.style.display = 'none';
        gameSection.style.display = 'block';
        loadGame();
        updateDisplay();
        updateTimer();
    }
});

setInterval(() => {
    score += autoClickerValue;
    timeLeft--;
    updateDisplay();
    updateTimer();
    saveGame();

    if (timeLeft <= 0) {
        convertToGold();
        timeLeft = 10 * 24 * 60 * 60; // Скидаємо таймер на 10 днів
    }
}, 1000);