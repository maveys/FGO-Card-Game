module.exports = [
    {
        id = 1,
        name = "NIKOLA TESLA",
        baseAtk = 6,
        attack = 6,
        traits = ['MALE', 'SERVANT'],
        abilityType = 'COMBAT',
        ability = [
                {
                    name: 'gainAttack',
                    value: 2,
                    condition: 'cardRevealCount'
                }
        ],
        noblePhantasm = [
            {
                name: 'gainAttack',
                value: 4,
                condition: 'earthServant'
            },
            {
                name: 'disableAbility',
                value: 2,
                condition: 'discardCards'
            }
        ],
        imageLink = '1'
    },
    {
        id = 2,
        name = "TOMOE GOZEN",
        baseAtk = 8,
        attack = 8,
        traits = ['FEMALE', 'DEMONIC', 'EARTH', 'SERVANT'],
        abilityType = 'COMBAT',
        ability = [
            {
                name: 'gainAttack',
                value: 5,
                condition: 'discards',
                conditionValue: 1
            }
        ],
        noblePhantasm = [
            {
                name: 'stealCard',
                value: 1,
                condition: 'greaterAttack',
                conditionValue: 4
            },
            {
                name: 'stealCard',
                value: 1,
                condition: 'greaterAttck',
                conditionValue: 7
            }
        ],
        imageLink = '2'
    }
];