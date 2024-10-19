/**
 * Vrací jméno pro konkretniho hrace v poradi
 * @param {Number} playerNumber 
 * @returns playerName
 */
function getPlayerName(playerNumber) {
    let playerName = prompt(`Zadejte jméno pro hráče ${playerNumber}:`);
    
    // Ošetření prázdného vstupu nebo stisknutí tlačítka "Zrušit"
    if (playerName === null || playerName.trim() === "") {
        playerName = `Hráč ${playerNumber}`;
        console.log(`Hráč ${playerNumber} nezadal jméno, použito výchozí jméno: ${playerName}`);
    } else {
        playerName = playerName.trim(); // Odstraní přebytečné mezery na začátku a konci
    }
    return playerName;
}

/**
 * Vrací náhodné číslo od 1 do 6
 * @returns randomNumber
 */
function playDice() {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    //console.log(`You rolled a ${randomNumber}!`);
    return randomNumber;
}
function rollDice(countDice) {
    diceArray = [];
    for (let i = 0; i < countDice; i++) {
        diceArray.push(playDice());
    }
    //console.log("diceArray: " + diceArray);
    showDiceImages(diceArray);
}