// Constants
const MIN_ROUND_SCORE = 350;
const MIN_WIN_SCORE = 100;
const INITIAL_DICE_COUNT = 6;

// Game state
let gameState = {
    diceArray: [2, 2, 2, 1, 1, 1],
    rollKz: 1,
    evalDiceArray: [],
    diceArrayTmp: [],
    straight: false,
    couples: false,
    allDicesSum: 0,
    checkNr: [],
    roundScore: 0,
    player: 0,
    totalScore: [["Hráč 1", 0], ["Hráč 2", 0]],
    totalScoreArray: [[], []],
    rollScore: 0,
    kzFce: 0,
    marked: 0,
    credited: 0,
    multiplayer: false
};

// DOM Elements
const domElements = {
    newGame: document.getElementById("newGame"),
    goClose: document.getElementById("goClose"),
    btnPlay: document.getElementById('play'),
    btnPlayAgain: document.getElementById('playAgain'),
    btnWriteScore: document.getElementById('writeScore'),
    btnNextRound: document.getElementById('nextRound'),
    h2roundScore: document.getElementById('roundScore'),
    h2totalScore: document.getElementById('totalScore'),
    h2rollScore: document.getElementById('rollScore'),
    btnTakeAll: document.getElementById('takeAll'),
    h2Player: document.getElementById("h2Player"),
    h4Player1: document.getElementById("h4Player1"),
    h4Player2: document.getElementById("h4Player2"),
    goWinner: document.getElementById("goWinner"),
    goScore: document.getElementById("goScore"),
    goPlayer: document.getElementById('goPlayer'),
    gameover: document.getElementById('gameover'),
    divPlayer2: document.getElementById('divPlayer2')
};

// Event Listeners
function addEventListeners() {
    domElements.newGame.addEventListener("click", newGame);
    domElements.goClose.addEventListener("click", closeGameOver);
    domElements.btnPlay.addEventListener('click', play);
    domElements.btnPlayAgain.addEventListener('click', playAgain);
    domElements.btnWriteScore.addEventListener('click', restoreGame);
    domElements.btnNextRound.addEventListener('click', restoreGame);
    domElements.btnTakeAll.addEventListener('click', takeAll);
}
// Game Logic Functions
//new
function resetGameStateMultiplayer() {
    gameState = {
        ...gameState,
        evalDiceArray: [],
        diceArrayTmp: [],
        straight: false,
        couples: false,
        allDicesSum: 0,
        checkNr: [],
        roundScore: 0,
        player: 0,
        totalScoreArray: [[], []],
        rollScore: 0,
        kzFce: 0,
        marked: 0,
        credited: 0
    };
    gameState.totalScore[0][1] = 0;
    gameState.totalScore[1][0] = 0;
}
//new
function newGame() {
    if (gameState.multiplayer) {
        resetGameStateMultiplayer();
        updateUI();
    } else {
        location.reload();
    }
}
//new
function updateUI() {
    addItemToList(0);
    addItemToList(1);
    domElements.h2Player.textContent = gameState.totalScore[gameState.player][0];
    domElements.h2totalScore.textContent = gameState.totalScore[gameState.player][1];
    restoreGameBoard();
}
//new
function restoreRoll(){
    updatePlayerInfo();
    resetRollState();
    handleDiceRoll();
    domElements.btnPlay.disabled = true;
    evaluate(gameState.diceArray, 1);
    evalRoll();
}
//new
function updatePlayerInfo() {
    domElements.h2Player.textContent = gameState.totalScore[gameState.player][0];
    domElements.h4Player1.textContent = gameState.totalScore[0][0];
    domElements.h4Player2.textContent = gameState.totalScore[1][0];
}
//new
function resetRollState() {
    gameState.straight = false;
    gameState.couples = false;
    gameState.allDicesSum = 0;
}
//new
function handleDiceRoll() {
    if (gameState.rollKz === 1) {
        rollDice(INITIAL_DICE_COUNT);
    } else {
        gameState.rollKz = 1;
        showDiceImages(gameState.diceArray);
    }
}
//new
function play() {
    gameState.roundScore = 0;
    restoreRoll();
}
function playAgain() {
    //console.log("playAgain");
    //console.log("allDicesSum: " + gameState.allDicesSum);
    //console.log("credited: " + gameState.credited);
    if (gameState.allDicesSum < INITIAL_DICE_COUNT) {
        handleIncompleteRoll();
    } else {
        handleCompleteRoll();
    }
}
//new
function handleIncompleteRoll() {
    evaluate(gameState.diceArrayTmp, 2);
    updateScores();
    gameState.diceArrayTmp = [];
    rollDice(INITIAL_DICE_COUNT - gameState.allDicesSum);
    evaluate(gameState.diceArray, 1);
    evalRoll();
}
//new
function handleCompleteRoll() {
    gameState.diceArrayTmp = [];
    gameState.evalDiceArray = [];
    clearDiceImages(true);
    restoreRoll();
}
//new
function updateScores() {
    if (gameState.credited === 0) {
        gameState.roundScore += gameState.rollScore;
        domElements.h2roundScore.textContent = gameState.roundScore;
    } else {
        gameState.credited = 0;
    }
}
//new    
function restoreGameBoard() {
    domElements.btnPlay.disabled = false;
    domElements.h2roundScore.textContent = "0";
    domElements.h2rollScore.textContent = "0";
    domElements.btnPlayAgain.disabled = true;
    domElements.btnTakeAll.disabled = true;
    domElements.btnWriteScore.disabled = true;
    domElements.btnNextRound.disabled = true;
    clearDiceImages(true);
    clearDiceImages();
}  
function restoreGame() {
    restoreGameBoard();
    updateGameState();
    //console.log("Total score: " + totalScore[player][1]);
    checkForWinner();
    switchPlayer()
}
//new
function updateGameState() {
    gameState.evalDiceArray = [];
    gameState.diceArrayTmp = [];
    //console.log("Player: " + gameState.player);
    gameState.totalScore[gameState.player][1] += gameState.roundScore;
    gameState.totalScoreArray[gameState.player].push(gameState.roundScore);
    domElements.h2totalScore.textContent = gameState.totalScore[gameState.player][1];
    addItemToList(gameState.player);
}
//new
function checkForWinner() {
    if (gameState.totalScore[gameState.player][1] >= MIN_WIN_SCORE) {
        displayWinnerMessage();
        domElements.btnPlay.disabled = true;
    }
}
//new
function displayWinnerMessage() {
    if (gameState.multiplayer) {
        domElements.goWinner.textContent = gameState.totalScore[gameState.player][0];
        domElements.goScore.textContent = `${gameState.totalScore[gameState.player][1]} bodů v ${gameState.totalScoreArray[gameState.player].length}. kole`;
        domElements.goPlayer.style.display = 'block';
    } else {
        domElements.goScore.textContent = `${gameState.totalScore[gameState.player][1]} bodů v ${gameState.totalScoreArray[gameState.player].length}. kole`;
    }
    console.log("Game over");   
    gameOver();
}
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
function gameOver(){
    domElements.gameover.style.display = 'block';
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            console.log("Confetti");
            confetti({
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                particleCount: randomInRange(50, 100),
                origin: { y: 0.6 },
            });            
        }, i*1000);
    }
}
//new
function switchPlayer() {
    if (gameState.multiplayer) {
        //console.log("velikost total score: " + gameState.totalScore.length);
        gameState.player = (gameState.player < gameState.totalScore.length - 1) ? gameState.player + 1 : 0;
        //console.log("NEW Player: " + gameState.player);
        domElements.h2Player.textContent = gameState.totalScore[gameState.player][0];
        domElements.h2totalScore.textContent = gameState.totalScore[gameState.player][1];
    }
}
//new
function evalRoll(){
    //console.log(`Roll score: ${gameState.rollScore}`);
    //console.log("Round score: " + gameState.roundScore);
    //console.log("allDiceSum: " + gameState.allDicesSum);
    updateButtonStates();
    updateScoreDisplay();
}
//new
function updateButtonStates() {
    domElements.btnPlayAgain.disabled = false;
    // console.log(`Roul score: ${gameState.rollScore}`);
    // console.log(gameState.roundScore < MIN_ROUND_SCORE);
    // console.log(gameState.roundScore >= MIN_ROUND_SCORE);
    domElements.btnWriteScore.disabled = (gameState.roundScore < MIN_ROUND_SCORE);
    domElements.btnNextRound.disabled = (gameState.roundScore >= MIN_ROUND_SCORE);
    domElements.btnTakeAll.disabled = (gameState.rollScore === 0);
}
//new
function updateScoreDisplay() {
    if (gameState.rollScore === 0) {
        gameState.roundScore = 0;
        gameState.rollScore = 0;
        domElements.btnPlayAgain.disabled = true;
        domElements.btnWriteScore.disabled = true;
        domElements.btnNextRound.disabled = false;
    }
    domElements.h2roundScore.textContent = gameState.roundScore;
    domElements.h2rollScore.textContent = gameState.rollScore;
}
//new
function takeAll() {
    for(let die = 0; die < INITIAL_DICE_COUNT; die++) {
        const clickDice = document.getElementById(`dice${die + 1}`);
        if (clickDice.classList.contains('diceBorderGreen')) {
            diceEvalMove(clickDice, 1);
        }
    };
    domElements.btnTakeAll.disabled = true;
}
//new
function diceEvalMove(e,fce = 0) {
    //console.log('Funkce:', fce);
    // fce 0 - ID kostky je odebrána z EventListeneru, 1 - ID kostky je parametrem volání funkce
    const clickId = getClickId(e, fce);
    //console.log('Index kostky je:', clickId);
    updateDiceArrays(clickId);
    gameState.allDicesSum += 1;
    //console.log(clickId, 'kostka byla odebrana');
    clearRolledDice(clickId);
    showDiceImages(gameState.evalDiceArray, true);
    //console.log('allDicesSum:', gameState.allDicesSum);
    //console.log('marked:', gameState.marked);
    updateRoundScore();
    evalRoll();
}
//new
function getClickId(e, fce) {
    const clickedDivId = fce === 0 ? e.currentTarget.id : e.id;
    return parseInt(clickedDivId[clickedDivId.length - 1]) - 1;
}
//new
function updateDiceArrays(clickId) {
    gameState.diceArrayTmp.push(parseInt(gameState.diceArray[clickId]));
    gameState.evalDiceArray.push(parseInt(gameState.diceArray[clickId]));
    gameState.diceArray.splice(clickId, 1, 9);
    //console.log('diceArray:', gameState.diceArray);
    //console.log('evalDiceArray:', gameState.evalDiceArray);
    //console.log('diceArrayTmp:', gameState.diceArrayTmp);
}
//new
function updateRoundScore() {
    if (gameState.marked === gameState.diceArrayTmp.length) {
        gameState.roundScore += gameState.rollScore;
        gameState.credited = 1;
    }
}
// Initialization
document.addEventListener('DOMContentLoaded', () => {
    setMultiplayerState();
    addEventListeners();
});