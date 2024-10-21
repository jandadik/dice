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

// let diceArray = [1,2,3,4,5,6]; // pole pro hodnoty kostek
// let rollKz = 0; // 0 - pouzije se v 1. kole vychozich hodnot pole diceArray, 1 - pole diceArray je vyplneny nahodnymi hodnotami
// let evalDiceArray = []; // pole pro hodnoty kostek, ktere byly vyhodnoceny
// let diceArrayTmp = [];
// let straight = false;
// let couples = false;
// let allDicesSum = 0;
// let checkNr = [];
// let roundScore = 0;
// let player = 0;
// let totalScore = [["Hrac 1",0],["Hrac 2",0]];
// let totalScoreArray = [[],[]];
// let rollScore = 0;
// const minRoundScore = 350;
// const minWinScore = 10000;
// let kzFce = 0;
// let marked = 0;
// let credited = 0;
// let multiplayer = false;

document.getElementById("newGame").addEventListener("click", newGameClick);
document.getElementById("goClose").addEventListener("click", closeGameOver);
const btnPlay = document.getElementById('play');
const btnPlayAgain = document.getElementById('playAgain');
const btnWriteScore = document.getElementById('writeScore');
const btnNextRound = document.getElementById('nextRound');
const h2roundScore = document.getElementById('roundScore');
const h2totalScore = document.getElementById('totalScore');
const h2rollScore = document.getElementById('rollScore');
const btnTakeAll = document.getElementById('takeAll');

btnPlay.addEventListener('click', play);
btnPlayAgain.addEventListener('click', playAgain);
btnWriteScore.addEventListener('click', restoreGame);
btnNextRound.addEventListener('click', restoreGame);
btnTakeAll.addEventListener('click', takeAll);

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
        document.getElementById("h2Player").textContent = gameState.totalScore[player][0];
        document.getElementById("totalScore").textContent = gameState.totalScore[player][1];
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
    document.getElementById("h2Player").textContent = gameState.totalScore[gameState.player][0];
    document.getElementById("h4Player1").textContent = gameState.totalScore[0][0];
    document.getElementById("h4Player2").textContent = gameState.totalScore[1][0];
    gameState.straight = false;
    gameState.couples = false;
    gameState.allDicesSum = 0;
    if (gameState.rollKz === 1) {
        rollDice(6);
    } else {
        gameState.rollKz=1;
        showDiceImages(gameState.diceArray);
    }
    btnPlay.disabled = true;
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
    btnPlay.disabled = false;
    h2roundScore.textContent = "0";
    h2rollScore.textContent = "0";
    btnPlayAgain.disabled = true;
    btnTakeAll.disabled = true;
    btnWriteScore.disabled = true;
    btnNextRound.disabled = true;
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
    h2totalScore.textContent = gameState.totalScore[gameState.player][1];
    document.getElementById("totalScore").textContent = gameState.totalScore[gameState.player][1];
    addItemToList(gameState.player);
    //console.log("Total score: " + totalScore[player][1]);
    if (gameState.totalScore[gameState.player][1] >= MIN_WIN_SCORE) {
        if (gameState.multiplayer) {
            document.getElementById("goWinner").textContent = gameState.totalScore[gameState.player][0];
            document.getElementById("goScore").textContent = `${gameState.totalScore[gameState.player][1]} bodu v ${gameState.totalScoreArray[gameState.player].length}. kole`;
            document.getElementById('goPlayer').style.display = 'block';
            document.getElementById('gameover').style.display = 'block';
            //alert(`Gratulace! Vyhral hrac ${totalScore[player][0]} v ${totalScoreArray[player].length}. kole s celkovym poctem ${totalScore[player][1]} bodu.`);
        } else {
            document.getElementById("goScore").textContent = `${gameState.totalScore[gameState.player][1]} bodu v ${gameState.totalScoreArray[gameState.player].length}. kole`;
            document.getElementById('gameover').style.display = 'block';
            //alert(`Gratulace! Vyhra v ${totalScoreArray[player].length}. kole s celkovym poctem ${totalScore[player][1]} bodu.`);
        }
        btnPlay.disabled = true;
    }
    if (gameState.multiplayer) {
        console.log("velikost total score: " + gameState.totalScore.length);
        if (player < gameState.totalScore.length-1) {
            player+= 1;
        }else {
            player = 0;
        }
        console.log("Player: " + gameState.player);
        document.getElementById("h2Player").textContent = gameState.totalScore[player][0];
        document.getElementById("totalScore").textContent = gameState.totalScore[player][1];
    }
}

function evalRoll(){
    console.log(`Roll score: ${gameState.rollScore}`);
    console.log("Round score: " + gameState.roundScore);
    //console.log("allDiceSum: " + gameState.allDicesSum);
    btnPlayAgain.disabled = false;
    if (gameState.roundScore >= MIN_ROUND_SCORE) {
        btnWriteScore.disabled = false;
    } else {
        btnNextRound.disabled = false;
    }
    if (gameState.rollScore > 0) {
        btnTakeAll.disabled = false;
    }
    if (gameState.rollScore === 0){
        gameState.roundScore = 0;
        gameState.rollScore = 0;
        btnPlayAgain.disabled = true;
        btnWriteScore.disabled = true;
        btnNextRound.disabled = false;
    }
    h2roundScore.textContent = gameState.roundScore;
    h2rollScore.textContent = gameState.rollScore;
}
function takeAll() {
    for(let die = 0; die < 6; die++) {
        const clickDice = document.getElementById(`dice${die + 1}`);
        clickDice.classList.contains('diceBorderGreen')? diceEvalMove(clickDice,1): console.log("nic") ;
    };
    btnTakeAll.disabled = true;
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
document.addEventListener('DOMContentLoaded', setMultiplayerState);