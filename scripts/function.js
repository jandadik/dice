/**
 * Returns the name for a specific player
 * @param {Number} playerNumber 
 * @returns {string} playerName
 */
function getPlayerName(playerNumber) {
    let playerName = prompt(`Zadejte jméno pro hráče ${playerNumber}:`);
    if (playerName === null || playerName.trim() === "") {
        playerName = `Hráč ${playerNumber}`;
        //console.log(`Hráč ${playerNumber} nezadal jméno, použito výchozí jméno: ${playerName}`);
    } 
    return playerName.trim();
}

/**
 * Returns a random number from 1 to 6
 * @returns {number} randomNumber
 */
function rollSingleDice() {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    //console.log(`You rolled a ${randomNumber}!`);
    return randomNumber;
}

/**
 * Rolls multiple dice and updates the game state
 * @param {number} countDice 
 * @returns {number[]} diceArray
 */
function rollDice(countDice) {
    diceArray = [];
    for (let i = 0; i < countDice; i++) {
        diceArray.push(rollSingleDice());
    }
    //console.log("diceArray: " + diceArray);
    showDiceImages(diceArray);
    return diceArray;
}