// JavaScript for game logic
const settingsSection = document.getElementById('settings-section');
const gameSection = document.getElementById('game-section');

const minRangeInput = document.getElementById('min-range');
const maxRangeInput = document.getElementById('max-range');
const startGameBtn = document.getElementById('start-game-btn');

const instructionText = document.getElementById('instruction-text');
const guessesLeftSpan = document.getElementById('guesses-left-span');
const feedback = document.getElementById('feedback');
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const previousGuessesList = document.getElementById('previous-guesses-list');
const playAgainBtn = document.getElementById('play-again-btn');

let min, max, secretNumber, guessesLeft, previousGuesses;
const GUESS_LIMIT = 10;
        
// --- Event Listeners ---
startGameBtn.addEventListener('click', startGame);
guessBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
});
playAgainBtn.addEventListener('click', resetToSettings);


// --- Game Flow Functions ---
function startGame() {
    min = parseInt(minRangeInput.value);
    max = parseInt(maxRangeInput.value);

    // Validate range
    if (isNaN(min) || isNaN(max) || min >= max) {
        alert('Please enter a valid range where the first number is smaller than the second.');
        return;
    }

    secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    guessesLeft = GUESS_LIMIT;
    previousGuesses = [];
            
    // Update UI
    settingsSection.style.display = 'none';
    gameSection.style.display = 'block';
    playAgainBtn.classList.add('hidden');
    guessBtn.disabled = false;
    guessInput.disabled = false;
            
    instructionText.textContent = `I'm thinking of a number between ${min} and ${max}.`;
    guessesLeftSpan.textContent = guessesLeft;
    feedback.textContent = 'Make your first guess!';
    feedback.className = 'feedback-warn';
    previousGuessesList.innerHTML = '';
    guessInput.value = '';
    guessInput.focus();
}
        
function handleGuess() {
    const userGuess = parseInt(guessInput.value);

    // Validate input
    if (isNaN(userGuess) || userGuess < min || userGuess > max) {
        setFeedback(`Enter a number between ${min} and ${max}.`, 'error');
        guessInput.value = '';
        return;
    }
            
    if (previousGuesses.includes(userGuess)) {
        setFeedback(`You already guessed ${userGuess}!`, 'error');
        guessInput.value = '';
        return;
    }

    // Process guess
    guessesLeft--;
    previousGuesses.push(userGuess);
    updatePreviousGuesses();
    guessesLeftSpan.textContent = guessesLeft;
            
    if (userGuess === secretNumber) {
        endGame(true);
    } else if (userGuess < secretNumber) {
        setFeedback(`${userGuess} is Too Low!`, 'warn');
    } else {
        setFeedback(`${userGuess} is Too High!`, 'warn');
    }
            
    if (guessesLeft === 0 && userGuess !== secretNumber) {
        endGame(false);
    }
            
    guessInput.value = '';
    guessInput.focus();
}

function endGame(isWin) {
    guessInput.disabled = true;
    guessBtn.disabled = true;
    playAgainBtn.classList.remove('hidden');

    if (isWin) {
        setFeedback(`YOU GOT IT! The number was ${secretNumber}.`, 'correct');
    } else {
        setFeedback(`Game Over! The number was ${secretNumber}.`, 'error');
    }
}
        
function resetToSettings() {
    settingsSection.style.display = 'block';
    gameSection.style.display = 'none';
}


// --- UI Update Functions ---
function setFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback-${type}`;
}
        
function updatePreviousGuesses() {
    const guess = previousGuesses[previousGuesses.length - 1];
    const li = document.createElement('li');
    li.textContent = guess;
    li.className = 'guess-bubble';
    previousGuessesList.appendChild(li);
}