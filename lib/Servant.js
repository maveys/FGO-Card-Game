class Servant {
    construction(data) {
        this.id = data.id;
        this.name = data.name;
        this.data = {
            class: data.servantClass,
            attack: data.attack,
            traits: data.traits,
            abilityType: data.abilityType,
            ability: data.ability,
            noblePhantasm: data.noblePhantasm,
            imageLink: data.imageLink,
        };
        this.state = {

        };


    }
}


module.exports = Servant;