var Servant = require('./Servant');
var Player  = require('./Player');

function Board() {
    this.players = [];
    this.turn = 0;
    this.confirmedPlayerOneTurn = false;
    this.confirmedPlayerTwoTurn = false;
}

Board.prototype.addPlayer = function(username, socket) {
    if (this.players.length >= 2) return; // TODO: send room is full when multiple rooms is supported
    var player = new Player(username, socket.id);
    this.players.push( player );
}

Board.prototype.updateState = function() {
    if (this.confirmedPlayerOneTurn && this.confirmedPlayerTwoTurn) {
        // send update
        this.confirmedPlayerOneTurn = this.confirmedPlayerTwoTurn = false;
        this.turn++;
    } else {
        // wait for either player to finish
    }
}

Board.prototype.initGame = function() {
    let deck = [];
    for (var i = 0; i < 90; i++) {
        deck.push(i);
    }

    deck = shuffleArray(deck);
    
    for (var i = 0; i < 60; i++) {
        if (i % 2 === 0) {
            this.players[0].deck.push(deck[i]);
        }
        else {
            //this.players[1].deck.push(deck[i]);
        }
    } 
    this.players[0].drawHand();
    //this.players[1].drawHand();
}

/**
 * every player take 3 cards from top of deck and place face down
 * all noble phantasms activate this phase
 * each player in war will choose another servant in their hand to play (facedown)
 * wait for both players then reveal card
 * if no cards, play next card on top of deck
 */
Board.prototype.activateWar = function() {
    
}

/**
 * 1. PASSIVE abilities activate
 * 2. ClASS (check if a war triggers or not)
 * 3. BASE ATK (check if a war triggers or not)
 * 4. COMBAT abilities activate
 * 5. NEW ATK (check if a war triggers or not)
 * @param {servant class in servants in play for player one} servantOne 
 * @param {servant class in servants in play for player two} servantTwo 
 */
Board.prototype.activateBattle = function(servantOne, servantTwo) {
    servantOne.activatePassiveAbility();
    servantTwo.activatePassiveAbility();

    // check if the servant classes are equal or if their base attack is equal
    if (servantOne.servantClass === servantTwo.servantClass || servantOne.baseAtk == servantTwo.baseAtk) {
        this.activateWar();
        return;
    }
    servantOne.activateAbility();
    servantTwo.activateAbility();
    
    // check the buffed/debuffed attacks
    if (servantOne.attack == servantTwo.attack) {
        this.activateWar();
        return;
    }

    if (servantOne.attack > servantTwo.attack) {
        // add lower attack to throne
    } else {
        // add higher attack to discard pile
    }
}

// Fisher-Yates Shuffle algorithm
function shuffleArray(array) {
    var currentIndex = array.length, tempValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
    }
    return array;
}

module.exports = Board;