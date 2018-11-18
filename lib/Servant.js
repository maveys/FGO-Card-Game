class Servant {
    construction(data) {
        this.id = data.id;
        this.name = data.name;
        this.baseAtk = data.baseAtk;
        this.attack = data.attack;
        this.traits = data.traits;
        this.abilityType = data.abilityType;
        this.ability = data.ability;
        this.noblePhantasm = data.noblePhantasm;
        this.imageLink = data.imageLink;
    }
}
module.exports = Servant;