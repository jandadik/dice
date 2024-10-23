// Constants
const MIN_ROUND_SCORE = 350;
const MIN_WIN_SCORE = 10000;
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
    domElements.newGame.addEventListener("click", newGameClick);
    domElements.goClose.addEventListener("click", closeGameOver);
    domElements.btnPlay.addEventListener('click', play);
    domElements.btnPlayAgain.addEventListener('click', playAgain);
    domElements.btnWriteScore.addEventListener('click', restoreGame);
    domElements.btnNextRound.addEventListener('click', restoreGame);
    domElements.btnTakeAll.addEventListener('click', takeAll);
}


function newGame() {
    if (gameState.multiplayer) {
        gameState.evalDiceArray = [];
        gameState.diceArrayTmp = [];
        gameState.straight = false;
        gameState.couples = false;
        gameState.allDicesSum = 0;
        gameState.checkNr = [];
        gameState.roundScore = 0;
        gameState.player = 0;
        gameState.totalScore[0][1] = 0;
        gameState.totalScore[1][1] = 0;
        gameState.totalScoreArray = [[],[]];
        gameState.rollScore = 0;
        gameState.kzFce = 0;
        gameState.marked = 0;
        gameState.credited = 0;
        addItemToList(0);
        addItemToList(1);
        domElements.h2Player.textContent = gameState.totalScore[gameState.player][0];
        domElements.h2totalScore.textContent = gameState.totalScore[gameState.player][1];
        restoreGameBoard();
    } else {
        location.reload();
    }
}
function newGameClick() {
    //location.reload();
    newGame();
}
function restoreRoll(){
    domElements.h2Player.textContent = gameState.totalScore[gameState.player][0];
    domElements.h4Player1.textContent = gameState.totalScore[0][0];
    domElements.h4Player2.textContent = gameState.totalScore[1][0];
    gameState.straight = false;
    gameState.couples = false;
    gameState.allDicesSum = 0;
    if (gameState.rollKz === 1) {
        rollDice(6);
    } else {
        gameState.rollKz=1;
        showDiceImages(gameState.diceArray);
    }
    domElements.btnPlay.disabled = true;
    evaluate(gameState.diceArray, 1);
    evalRoll();
}
function play() {
    gameState.roundScore = 0;
    restoreRoll();
}
function playAgain() {
    console.log("playAgain");
    console.log("allDicesSum: " + gameState.allDicesSum);
    console.log("credited: " + gameState.credited);
    if(gameState.allDicesSum < 6) {
        evaluate(gameState.diceArrayTmp, 2);
        if (gameState.credited === 0) {
            gameState.roundScore += gameState.rollScore;
            h2roundScore.textContent = gameState.roundScore;
        } else {
            gameState.credited = 0;
        }
        gameState.diceArrayTmp = [];
        rollDice(6-gameState.allDicesSum);
        evaluate(gameState.diceArray, 1);
        evalRoll();
    } else {
        gameState.diceArrayTmp = [];
        gameState.evalDiceArray = [];
        clearDiceImages(true);
        restoreRoll();
    }
}    
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
    gameState.evalDiceArray = [];
    gameState.diceArrayTmp = [];
    console.log("Player: " + gameState.player);
    gameState.totalScore[gameState.player][1] += gameState.roundScore;
    gameState.totalScoreArray[gameState.player].push(gameState.roundScore);
    domElements.h2totalScore.textContent = gameState.totalScore[gameState.player][1];
    addItemToList(gameState.player);
    //console.log("Total score: " + totalScore[player][1]);
    if (gameState.totalScore[gameState.player][1] >= MIN_WIN_SCORE) {
        if (gameState.multiplayer) {
            domElements.goWinner.textContent = gameState.totalScore[gameState.player][0];
            domElements.goScore.textContent = `${gameState.totalScore[gameState.player][1]} bodu v ${gameState.totalScoreArray[gameState.player].length}. kole`;
            domElements.goPlayer.style.display = 'block';
            domElements.gameover.style.display = 'block';
            //alert(`Gratulace! Vyhral hrac ${totalScore[player][0]} v ${totalScoreArray[player].length}. kole s celkovym poctem ${totalScore[player][1]} bodu.`);
        } else {
            domElements.goScore.textContent = `${gameState.totalScore[gameState.player][1]} bodu v ${gameState.totalScoreArray[gameState.player].length}. kole`;
            domElements.gameover.style.display = 'block';meover.style.display = 'block';
            //alert(`Gratulace! Vyhra v ${totalScoreArray[player].length}. kole s celkovym poctem ${totalScore[player][1]} bodu.`);
        }
        domElements.btnPlay.disabled = true;
    }
    if (gameState.multiplayer) {
        console.log("velikost total score: " + gameState.totalScore.length);
        if (gameState.player < gameState.totalScore.length-1) {
            gameState.player+= 1;
        }else {
            gameState.player = 0;
        }
        console.log("Player: " + gameState.player);
        domElements.h2Player.textContent = gameState.totalScore[gameState.player][0];
        domElements.h2totalScore.textContent = gameState.totalScore[gameState.player][1];
    }
}

function evalRoll(){
    console.log(`Roll score: ${gameState.rollScore}`);
    console.log("Round score: " + gameState.roundScore);
    //console.log("allDiceSum: " + gameState.allDicesSum);
    domElements.btnPlayAgain.disabled = false;
    if (gameState.roundScore >= MIN_ROUND_SCORE) {
        domElements.btnWriteScore.disabled = false;
    } else {
        domElements.btnNextRound.disabled = false;
    }
    if (gameState.rollScore > 0) {
        domElements.btnTakeAll.disabled = false;
    }
    if (gameState.rollScore === 0){
        gameState.roundScore = 0;
        gameState.rollScore = 0;
        domElements.btnPlayAgain.disabled = true;
        domElements.btnWriteScore.disabled = true;
        domElements.btnNextRound.disabled = false;
    }
    domElements.h2roundScore.textContent = gameState.roundScore;
    domElements.h2rollScore.textContent = gameState.rollScore;
}
function takeAll() {
    for(let die = 0; die < 6; die++) {
        const clickDice = document.getElementById(`dice${die + 1}`);
        clickDice.classList.contains('diceBorderGreen')? diceEvalMove(clickDice,1): console.log("nic") ;
    };
    domElements.btnTakeAll.disabled = true;
}
function diceEvalMove(e,fce = 0) {
    //console.log('Funkce:', fce);
    // fce 0 - ID kostky je odebrána z EventListeneru, 1 - ID kostky je parametrem volání funkce
    let clickId;
    let clickedDivId;
    // Získání ID kliknutého prvku
    if (fce === 0) {
        clickedDivId = e.currentTarget.id;
    } else {
        clickedDivId = e.id;
    }
    clickId = parseInt(clickedDivId[clickedDivId.length - 1])-1;
    //console.log('ID kliknutého divu je:', clickedDivId);
    //console.log('Index kostky je:', clickId);
    gameState.diceArrayTmp.push(parseInt(gameState.diceArray[clickId]));
    gameState.evalDiceArray.push(parseInt(gameState.diceArray[clickId]));
    gameState.diceArray.splice(clickId, 1, 9);
    //console.log('diceArray:', diceArray);
    //console.log('evalDiceArray:', evalDiceArray);
    //console.log('diceArrayTmp:', diceArrayTmp);
    gameState.allDicesSum += 1;
    //console.log(clickId, 'kostka byla odebrana');
    clearRolledDice(clickId);
    showDiceImages(gameState.evalDiceArray, true);
    //console.log('allDicesSum:', allDicesSum);
    //console.log('marked:', marked);
    if (gameState.marked === gameState.diceArrayTmp.length) {
        gameState.roundScore += gameState.rollScore;
        //rollScore = 0;
        gameState.credited = 1;
    }
    evalRoll();
}
// Volání funkce po načtení DOM
document.addEventListener('DOMContentLoaded', () => {
    setMultiplayerState();
    addEventListeners();
});