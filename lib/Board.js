var Servant = require('./Servant');
var Player  = require('./Player');

class Board {
    constructor() {
        this.players = [];
        this.confirmedTurns = [];
        this.turnCount = 0;
    }

    addPlayer(username, id) {
        if (this.players.length >= 2) return false;
        var player = new Player(username, id);
        this.players.push(player);
        this.confirmedTurns.push(false);
        return true;
    }

    getPlayer(id) {
        var player = this.players[id];
        return player != null ? player : null;
    }

    getOpponent(id) {
        return id === 0 ? this.players[1] : this.players[0];
    }

    updateState() { }

    initGame() {
        var deck = shuffleDeck();
        
        for (var i = 0; i < 60; i++) {
            (i % 2 === 0) ? this.players[0].deck.push(deck[i]) : this.players[1].deck.push(deck[i]);
        } 
        this.players[0].drawHand();
        this.players[1].drawHand();
    }

    activateWar() { }
    
    activateBattle() {
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
    
    getPlayerHand(id) {
        return this.players[id].hand;
    }
    
    getOpponentHand(id) {
        return id === 0 ? this.players[1].hand : this.players[0].hand;
    }
    
    removePlayer(id) {
        this.players.splice(id, 1);
    }
    
    updatePlayer(id, servantId) {
        var index = this.players[id].hand.indexOf(servantId);
        if (this.players[id] && index > -1 && !this.confirmedTurns[id]) {
            this.players[id].hand.splice(index, 1);
            this.players[id].servantsInPlay.push(servantId);
            this.confirmedTurns[id] = true;
            return true;
        }
        return false;
    }
    
    isBattleReady() {
        return this.confirmedTurns[0] && this.confirmedTurns[1];
    }
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