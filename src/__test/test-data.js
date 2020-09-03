const users = [
  {
    id: 'aela',
    firstName: 'Aela',
    lastName: 'the Huntress',
    email: 'aela@companions.org'
  },
  {
    id: 'elisif',
    firstName: 'Elisif',
    lastName: 'the Fair',
    email: 'jarl@solitude.gov'
  },
  {
    id: 'balgruuf',
    firstName: 'Balgruuf',
    lastName: 'the Greater',
    email: 'jarl@whiterun.gov'
  }
]

const oneuser = {
  id: 'ulfrics',
  firstname: 'Ulfric',
  lastName: 'Stormcloak',
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
