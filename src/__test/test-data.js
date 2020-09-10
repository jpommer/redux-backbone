const users = [
  {
    id: 'aela',
    firstName: 'Aela',
    lastName: 'the Huntress',
    location: 'Jorrvaskr, Whiterun',
    email: 'aela@companions.org'
  },
  {
    id: 'elisif',
    firstName: 'Elisif',
    lastName: 'the Fair',
    location: 'Blue Palace, Solitude',
    email: 'jarl@solitude.gov'
  },
  {
    id: 'balgruuf',
    firstName: 'Balgruuf',
    lastName: 'the Greater',
    location: 'Dragonreach, Whiterun',
    email: 'jarl@whiterun.gov'
  }
]

const oneuser = {
  id: 'ulfrics',
  firstName: 'Ulfric',
  lastName: 'Stormcloak',
  location: 'Palace of the Kings, Windhelm',
  email: 'ulfric@windhelm.gov'
}

const spells = [
  {
    id: 1,
    name: 'Fireball',
    level: 'Adept',
    description: 'A fireball which explodes on impact for 40 points of damage in a 15-foot radius. Targets on fire take extra damage.'
  },
  {
    id: 2,
    name: 'Flaming Familiar',
    level: 'Apprentice',
    description: 'Summons a Flaming Familiar which will charge into battle and explode.'
  },
  {
    id: 3,
    name: 'Conjure Storm Atronach',
    level: 'Expert',
    description: 'Summons a Storm Atronach for 60 seconds wherever the caster is pointing.'
  }
]

module.exports = {
  users,
  oneuser,
  spells
}
