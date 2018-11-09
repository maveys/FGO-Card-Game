var Servant = require('./Servant');

function Player(username, socket) {
    this.username = username;
    this.socketId = socket;
    this.deck = [];
    this.deckIndex = 0;
    this.commandSeals = [];
    this.hand = [];
    this.servantsInPlay = [];
    this.discardPile = [];
    this.throneOfHeroes = [];
}

Player.prototype.setUsername = function(username) {
    this.username = username;
}

Player.prototype.setDeck = function(deck) {
    this.deck = deck;
}

Player.prototype.setCS = function(cs) {
    this.commandSeals = cs;
}

Player.prototype.setHand = function(hand) {
    this.hand = hand;
}

Player.prototype.setServantsInPlay = function(servants) {
    this.servantsInPlay = servants;
}

Player.prototype.discardPile = function(discardPile) {
    this.discardPile = discardPile;
}

Player.prototype.throneOfHeroes = function(throne) {
    this.throneOfHeroes = throne;
}

Player.prototype.drawHand = function() {
    this.hand = this.deck.slice(0, 6);
    this.deckIndex = 6;
}

Player.prototype.drawCard = function() {
    if (this.hand.length < 8) {
        this.hand.push(this.deck[this.deckIndex++]);
        return true;
    } else {
        return false;
    }
}

module.exports = Player;