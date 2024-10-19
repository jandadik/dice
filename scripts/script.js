let diceArray = [2,2,2,1,1,1]; // pole pro hodnoty kostek
let rollKz = 1; // 0 - pouzije se v 1. kole vychozich hodnot pole diceArray, 1 - pole diceArray je vyplneny nahodnymi hodnotami
let evalDiceArray = []; // pole pro hodnoty kostek, ktere byly vyhodnoceny
let diceArrayTmp = [];
let straight = false;
let couples = false;
let allDicesSum = 0;
let checkNr = [];
let roundScore = 0;
let player = 0;
let totalScore = [["Hrac 1",0],["Hrac 2",0]];
let totalScoreArray = [[],[]];
let rollScore = 0;
const minRoundScore = 350;
const minWinScore = 10000;
let kzFce = 0;
let marked = 0;
let credited = 0;
let multiplayer = false;

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
    if (multiplayer) {
        evalDiceArray = [];
        diceArrayTmp = [];
        straight = false;
        couples = false;
        allDicesSum = 0;
        checkNr = [];
        roundScore = 0;
        player = 0;
        totalScore[0][1] = 0;
        totalScore[1][1] = 0;
        totalScoreArray = [[],[]];
        rollScore = 0;
        kzFce = 0;
        marked = 0;
        credited = 0;
        addItemToList(0);
        addItemToList(1);
        document.getElementById("h2Player").textContent = totalScore[player][0];
        document.getElementById("totalScore").textContent = totalScore[player][1];
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
    document.getElementById("h2Player").textContent = totalScore[player][0];
    document.getElementById("h4Player1").textContent = totalScore[0][0];
    document.getElementById("h4Player2").textContent = totalScore[1][0];
    straight = false;
    couples = false;
    allDicesSum = 0;
    if (rollKz === 1) {
        rollDice(6);
    } else {
        rollKz=1;
        showDiceImages(diceArray);
    }
    btnPlay.disabled = true;
    evaluate(diceArray, 1);
    evalRoll();
}
function play() {
    roundScore = 0;
    restoreRoll();
}
function playAgain() {
    console.log("playAgain");
    console.log("allDicesSum: " + allDicesSum);
    console.log("credited: " + credited);
    if(allDicesSum < 6) {
        evaluate(diceArrayTmp, 2);
        if (credited === 0) {
            roundScore += rollScore;
            h2roundScore.textContent = roundScore;
        } else {
            credited = 0;
        }
        diceArrayTmp = [];
        rollDice(6-allDicesSum);
        evaluate(diceArray, 1);
        evalRoll();
    } else {
        diceArrayTmp = [];
        evalDiceArray = [];
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
    evalDiceArray = [];
    diceArrayTmp = [];
    console.log("Player: " + player);
    totalScore[player][1] += roundScore;
    totalScoreArray[player].push(roundScore);
    h2totalScore.textContent = totalScore[player][1];
    document.getElementById("totalScore").textContent = totalScore[player][1];
    addItemToList(player);
    //console.log("Total score: " + totalScore[player][1]);
    if (totalScore[player][1] >= minWinScore) {
        if (multiplayer) {
            document.getElementById("goWinner").textContent = totalScore[player][0];
            document.getElementById("goScore").textContent = `${totalScore[player][1]} bodu v ${totalScoreArray[player].length}. kole`;
            document.getElementById('goPlayer').style.display = 'block';
            document.getElementById('gameover').style.display = 'block';
            //alert(`Gratulace! Vyhral hrac ${totalScore[player][0]} v ${totalScoreArray[player].length}. kole s celkovym poctem ${totalScore[player][1]} bodu.`);
        } else {
            document.getElementById("goScore").textContent = `${totalScore[player][1]} bodu v ${totalScoreArray[player].length}. kole`;
            document.getElementById('gameover').style.display = 'block';
            //alert(`Gratulace! Vyhra v ${totalScoreArray[player].length}. kole s celkovym poctem ${totalScore[player][1]} bodu.`);
        }
        btnPlay.disabled = true;
    }
    if (multiplayer) {
        console.log("velikost total score: " + totalScore.length);
        if (player < totalScore.length-1) {
            player+= 1;
        }else {
            player = 0;
        }
        console.log("Player: " + player);
        document.getElementById("h2Player").textContent = totalScore[player][0];
        document.getElementById("totalScore").textContent = totalScore[player][1];
    }
}

function evalRoll(){
    console.log(`Roll score: ${rollScore}`);
    console.log("Round score: " + roundScore);
    //console.log("allDiceSum: " + allDicesSum);
    btnPlayAgain.disabled = false;
    if (roundScore >= minRoundScore) {
        btnWriteScore.disabled = false;
    } else {
        btnNextRound.disabled = false;
    }
    if (rollScore > 0) {
        btnTakeAll.disabled = false;
    }
    if (rollScore === 0){
        roundScore = 0;
        rollScore = 0;
        btnPlayAgain.disabled = true;
        btnWriteScore.disabled = true;
        btnNextRound.disabled = false;
    }
    h2roundScore.textContent = roundScore;
    h2rollScore.textContent = rollScore;
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
    diceArrayTmp.push(parseInt(diceArray[clickId]));
    evalDiceArray.push(parseInt(diceArray[clickId]));
    diceArray.splice(clickId, 1, 9);
    //console.log('diceArray:', diceArray);
    //console.log('evalDiceArray:', evalDiceArray);
    //console.log('diceArrayTmp:', diceArrayTmp);
    allDicesSum += 1;
    //console.log(clickId, 'kostka byla odebrana');
    clearRolledDice(clickId);
    showDiceImages(evalDiceArray, true);
    //console.log('allDicesSum:', allDicesSum);
    //console.log('marked:', marked);
    if (marked === diceArrayTmp.length) {
        roundScore += rollScore;
        //rollScore = 0;
        credited = 1;
    }
    evalRoll();
}
// Volání funkce po načtení DOM
document.addEventListener('DOMContentLoaded', setMultiplayerState);