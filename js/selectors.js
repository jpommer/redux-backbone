const getUsers = (state, filter, id) => {
  switch(filter) {
    case 'All_USERS':
      return state.users
    case 'ONE_USER':
      return state.users.filter(u => u.id === id)[0] // TODO: handle empty results
    default:
      return state.users
  }
}

const getSpells = (state, filter, id) => {
  switch(filter) {
    default:
      return state.spells
  }
}

module.exports = { getUsers, getSpells }
