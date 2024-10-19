function showDiceImages(arrayToShow, eval) {
    if (eval) {
        //console.log("tu som show eval");
        clearDiceImages(true);
        idElement = "eDice";
        idImage = "eDiceImg";
    } else {
        //console.log("tu som show base");
        clearDiceImages();
        idElement = "dice";
        idImage = "diceImg";
    }
    for (let i = 0; i < arrayToShow.length; i++) {
        if (arrayToShow[i] !== 9) {
            diceBorder = document.getElementById(idElement + (i+1));
            const dice = document.createElement('img');
            dice.src = 'images/' + arrayToShow[i] + '.png';
            dice.style.width = '40px';
            dice.id = idImage + (i+1);
            diceBorder.appendChild(dice);
        }
    }
}
function clearDiceImages(eval) {
    let idDice = (eval)? "eDice" : "dice";
    for (let i = 0; i < 6; i++) {
        const diceToClear = document.getElementById(idDice + (i+1));
        diceToClear.innerHTML = '';
        if (!eval) {
            diceToClear.removeEventListener('click', diceEvalMove);
            diceToClear.classList.remove('diceBorderGreen');
        }
    }
}
/**
 * 
 * @param {*} diceId 
 */
function clearRolledDice(diceId) {
    const diceToClear = document.getElementById(`dice${diceId+1}`);
    diceToClear.innerHTML = '';
    diceToClear.removeEventListener('click', diceEvalMove);
    diceToClear.classList.remove('diceBorderGreen');
}

function addItemToList(playerNr) {
    console.log("Player: " + ('olPlayer' + (playerNr+1)));
    let list = document.getElementById('olPlayer' + (playerNr+1));
    list.innerHTML = '';
    let totalScoreList = 0;
    for (let i = 0; i < totalScoreArray[playerNr].length; i++) {
        totalScoreList += totalScoreArray[playerNr][i];
        let item = document.createElement('li');
        let textNode = document.createElement('p');
        textNode.textContent = (i +1) + ". kolo: " + totalScoreArray[playerNr][i] + ", skore celkem: " + totalScoreList;
        item.append(textNode);
        list.append(item);
    }
}
/**
 * Funkce pro nastavení a vyp/zap stavu multiplayer
 */
function setMultiplayerState() {
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    
    // Nastavení počátečního stavu
    multiplayer = switchElement.checked ? 1 : 0;
    console.log('Počáteční stav multiplayer:', multiplayer);

    // Přidání event listeneru pro změny
    switchElement.addEventListener('change', function() {
        multiplayer = this.checked ? true : false;
        console.log('Nový stav multiplayer:', multiplayer);
        document.getElementById('h2Player').style.display = multiplayer? 'block' : 'none';
        document.getElementById('h4Player1').style.display = multiplayer? 'block' : 'none';
        document.getElementById('divPlayer2').style.display = multiplayer? 'block' : 'none';
        if (multiplayer) {
            totalScore[0][0] = getPlayerName(1);
            totalScore[1][0] = getPlayerName(2);
            document.getElementById('h4Player1').textContent = totalScore[0][0];
            document.getElementById('h4Player2').textContent = totalScore[1][0];
        }
        newGame();
    });
}
function closeGameOver() {
    document.getElementById('gameover').style.display = 'none';
}
