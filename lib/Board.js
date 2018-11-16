var HashMap = require('hashmap');
var Servant = require('./Servant');
var Player  = require('./Player');

function Board() {
    this.players = new HashMap();
    this.turn = 0;
    this.confirmedPlayerOneTurn = false;
    this.confirmedPlayerTwoTurn = false;
}

Board.prototype.getOpponent = function(socketId) {
    var opponent;
    this.players.forEach(function(player, id) {
        if (id != socketId) opponent = player;
    });
    return opponent;
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
    var players = this.players.values();
    var deck = shuffleDeck();
    
    for (var i = 0; i < 60; i++) {
        (i % 2 === 0) ? players[0].deck.push(deck[i]) : players[1].deck.push(deck[i]);
    } 
    players[0].drawHand();
    players[1].drawHand();
    this.players.set(players[0].socketId, players[0]);
    this.players.set(players[1].socketId, players[1]);
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
    if (servantOne.servantClass === servantTwo.servantClass || servantOne.baseAttack == servantTwo.baseAttack) {
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
        players[0].discardServant(servantOne.id);
        players[1].toThrone(servantTwo.id);
    } else {
        players[0].toThrone(servantOne.id);
        players[1].discardServant(servantTwo.id);
    }
}

Board.prototype.getPlayerHand = function(socketId) {
    return this.players.get(socketId).hand;
}

Board.prototype.getOpponentHand = function(socketId) {
    var playerHand;
    this.players.forEach(function(player, id) {
        if (id != socketId) playerHand = player.hand;
    });
    return playerHand;
}

Board.prototype.removePlayer = function(socketId) {
    this.players.delete(socketId);
}

// Fisher-Yates Shuffle algorithm
function shuffleDeck() {
    var deck = []
    for (var i = 1; i < 85; i++) {
        deck.push(i);
    }
    var currentIndex = deck.length, tempValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        tempValue = deck[currentIndex];
        deck[currentIndex] = deck[randomIndex];
        deck[randomIndex] = tempValue;
    }
    return deck;
}

module.exports = Board;