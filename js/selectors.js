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

module.exports = { getUsers }
