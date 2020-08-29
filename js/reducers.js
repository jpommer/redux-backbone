
// reducer
function usersReducer(state = [], action) {
  switch (action.type) {
    case 'USERS_ADD':
      // filter out users we already have
      if(action.payload.filter !== undefined) {
        action.payload.filter(usr => state.indexOf(usr) === -1)
      } else if(state.indexOf(action.payload) > -1) {
        return state
      }
      return state.concat(action.payload)
    case 'USERS_UPDATE':
      const idx = state.filter(user => user.id === action.payload.id)
        .map(user => state.indexOf(user))[0]
      const front = state.slice(0,idx)
      const back = state.slice(idx+1)
      return front.concat(action.payload).concat(back)
    case 'USERS_DELETE':
      const index = state.indexOf(action.payload)
      return state.slice(0, index).concat(state.slice(index + 1))
    case 'USERS_DELETE_ALL':
      return state.slice(0,0)
    default:
      return state
  }
}

module.exports = {usersReducer}
