// Constants
const STRAIGHT_SCORE = 1500;
const COUPLES_SCORE = 1000;

// Score maps
const SCORE_MAP_15 = {
    6: 8000,
    5: 4000,
    4: 2000,
    3: 1000,
    2: 200,
    1: 100
};

const SCORE_MAP_2346 = {
    6: 800,
    5: 400,
    4: 200,
    3: 100
};

function evaluate(evalArray, kzFce) {
    kzFce = kzFce;
    rollScore = 0;
    marked = 0;
    checkNr = [[],[],[],[],[],[]];
    straightCount = 0;
    couplesCount = 0;
    //console.log(`Eval array: ${evalArray}`);
    for (let dnr = 1; dnr < 7; dnr++) {
        for (let i = 0; i < evalArray.length; i++) {
            if (evalArray[i] === dnr) {
                //console.log(`dnr: ${dnr}`);
                checkNr[dnr-1].push(i);
                //console.log(`nove pole of ${dnr}s: ${checkNr}`);
            }
        }
        if (checkNr[dnr-1].length === 2) {
            couplesCount++;
        }
        if (checkNr[dnr-1].length === 1) {
            straightCount++;
        }
    }
    if (straightCount === 6) {
        //console.log('straight');
        straight = true;
        rollScore += STRAIGHT_SCORE;
        if (rollScore > 0 || kzFce === 1) {
            paintWinDice([0,1,2,3,4,5]);
        }
    } else if (couplesCount === 3) {
        //console.log('couples');
        couples = true;
        if (allDicesSum === 0) {
            rollScore += COUPLES_SCORE;
            if (rollScore > 0 || kzFce === 1) {
                paintWinDice([0,1,2,3,4,5]);
            }
        }
    }
    if (!straight || !couples) {
        for (let dnr = 1; dnr < 7; dnr++) {
            if (dnr === 1 || dnr === 5) {
                checkNr15(checkNr[dnr-1], dnr);
            } else if (dnr === 2 || dnr === 3 || dnr === 4 || dnr === 6) {
                checkNr2346(checkNr[dnr-1], dnr);
            }
        }
    }
    kzFce = 0;
}
function checkNr15(nrDice, dnr) {
    let diceScore = 0;
    let divider = (dnr === 1)? 1 : 2;
    const scoreMap = {
        6: 8000,
        5: 4000,
        4: 2000,
        3: 1000,
        2: 200,
        1: 100
    };
    if (!straight && !couples && scoreMap[nrDice.length]) {
        diceScore += (scoreMap[nrDice.length]/divider);
        if (nrDice.length === 6) {
            allDices = true;
        }
        rollScore += diceScore;
        //console.log(`${dnr}s: ${diceScore}`);
    }
    if (diceScore > 0 || kzFce === 1) {
        paintWinDice(nrDice);
    }
}
function checkNr2346(nrDice, dnr) {
    let diceScore = 0;
    const scoreMap = {
        6: 800,
        5: 400,
        4: 200,
        3: 100
    };
    // Ověření a přidání skóre podle délky `nrDice`
    if (!straight && !couples && scoreMap[nrDice.length]) {
        diceScore += scoreMap[nrDice.length] * dnr;
        if (nrDice.length === 6) {
            allDices = true;
        }
        rollScore += diceScore;
        //console.log(`${dnr}s: ${diceScore}`);
    }
    // Aplikace efektu na všechny prvky v `nrDice`
    if (diceScore > 0 || kzFce === 1) {
        paintWinDice(nrDice);
    }
}
function paintWinDice(nrDice) {
    nrDice.forEach(die => {
        const clickDice = document.getElementById(`dice${die + 1}`);
        clickDice.classList.add('diceBorderGreen');
        clickDice.addEventListener('click', diceEvalMove);
        marked += 1;
    });
}