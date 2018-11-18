var HashMap = require('hashmap');
var Servant = require('./Servant');
var Player  = require('./Player');

class Board {
    constructor() {
        this.players = new HashMap();
        this.confirmedTurns = new HashMap();
        this.turnCount = 0;
    }

    addPlayer(username, socketId) {
        if (this.players.size >= 2) return false;
        var player = new Player(username, socketId);
        this.players.set(socketId, player);
        this.confirmedTurns.set(socketId, false);
        return true;
    }

    getPlayer(socketId) {
        var player = this.players.get(socketId);
        if (player) {
            return player;
        }
        return null;
    }

    getOpponent(socketId) {
        var opponent;
        this.players.forEach(function(player, id) {
            if (id != socketId) opponent = player;
        });
        return opponent;
    }

    updateState() { }

    initGame() {
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
    getPlayerHand(socketId) {
        return this.players.get(socketId).hand;
    }
    
    getOpponentHand(socketId) {
        var playerHand;
        this.players.forEach(function(player, id) {
            if (id != socketId) playerHand = player.hand;
        });
        return playerHand;
    }
    
    removePlayer(socketId) {
        this.players.delete(socketId);
    }
    
    updatePlayer(socketId, servantId) {
        var player = this.getPlayer(socketId);
        var index = player.hand.indexOf(servantId);
        if (player && index > -1 && !this.confirmedTurns.get(socketId)) {
            player.hand.splice(index, 1);
            player.servantsInPlay.push(servantId);
            this.confirmedTurns.set(socketId, true);
            this.players.set(socketId, player);
            return true;
        }
        return false;
    }
    
    isBattleReady() {
        var ready = true;
        this.confirmedTurns.forEach(function(val, key) {
            if (val === false) ready = false;
        });
        return ready;
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