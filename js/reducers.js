
// reducer
function usersReducer(state = [], action) {
  switch (action.type) {
    case 'USERS_ADD':
      return state.concat(action.payload)
    case 'USERS_UPDATE':
      const idx = state.indexOf(action.payload)
      const front = state.slice(0,idx)
      const back = state.slice(idx+1, state.length)
      front.push(action.payload)
      return front.concat(back)
    case 'USERS_DELETE':
      const index = state.indexOf(action.payload)
      return state.slice(0, index).concat(state.slice(index + 1, state.length))
    case 'USERS_DELETE_ALL':
      return state.slice(0,0)
    default:
      return state
  }
}

module.exports = {usersReducer}
