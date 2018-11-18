var Servant = require('./Servant');

class Player {
    constructor(username, id) {
        this.username = username;
        this.socketId = id;
        this.deck = [];
        this.deckIndex = 0;
        this.commandSeals = [];
        this.hand = [];
        this.servantsInPlay = [];
        this.discardPile = [];
        this.throneOfHeroes = [];
    }

    setDeck(deck) {
        this.deck = deck;
    }
    setCS(cs) {
        this.commandSeals = cs;
    }
    drawHand() {
        this.hand = this.deck.slice(0, 6);
        this.deckIndex = 6;
    }
    drawCard() {
        if (this.hand.length < 8) {
            this.hand.push(this.deck[this.deckIndex++]);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Player;