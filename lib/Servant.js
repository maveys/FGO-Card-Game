class Servant {
    construction(baseAtk, traits, abilityType, imgLink) {
        this.baseAtk = baseAtk;
        this.Atk;
        this.traits = traits;
        this.abilityType = abilityType;
        this.imgLink = imgLink;
    }

    activateAbility() {

    }

    activateNoblePhantasm() {

    }
}

class Lancelot extends Servant {
    constructor() {
        super(9,["MALE", "EARTH", "KNIGHT", "SERVANT"], "COMBAT", "54.png");
    }

    activateAbility() {

    }

    activateNoblePhantasm() {
        
    }
}
module.exports = Servant;