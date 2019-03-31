const axios = require('axios');

class Die {
    constructor(sides) {
        this.sides = sides;
    }

    roll() {
        return Math.floor(Math.random() * Math.floor(this.sides)) + 1;
    }
}

class CharacterSheet {
    constructor(name) {

        this.abilityScores = {};
        this.name = name;
        this.race = undefined;
        this.class = undefined;
        this.subclass = undefined;
        this.feature = undefined;

        function setAbilityScores() {
            let die = new Die(6);
            let sum = 0;
            let diceRolls = [die.roll(), die.roll(), die.roll(), die.roll()]

            diceRolls.sort((a, b) => { return a - b }).shift();
            sum = diceRolls.reduce((total, num) => { return total + num });

            return sum;
        }

        let abilities = [];

        axios.get('http://dnd5eapi.co/api/ability-scores')
            .then(response => {
                let abilitiesCount = response.data.results.length;
                for (let i = 0; i < abilitiesCount; i++) {
                    abilities.push(response.data.results[i].name);
                }

                for (let i = 0; i < abilities.length; i++) {
                    this.abilityScores[abilities[i]] = setAbilityScores();
                }
            })
            .catch(error => {
                console.log(error);
            });


        return this;
    }
}

new CharacterSheet();