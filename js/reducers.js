
// reducer
function usersReducer(state = [], action) {
  switch (action.type) {
    case 'USERS_ADD':
      // ignore users we already have
      if(action.payload.filter !== undefined) {
        action.payload.filter(usr => state.indexOf(usr) === -1)
      } else if(state.indexOf(action.payload) > -1) {
        return state
      }
      return state.concat(action.payload)
    case 'USERS_UPDATE':
      return newstate = state.filter(u => u.id !== action.payload.id).concat(action.payload)
    case 'USERS_DELETE':
      return state.filter(u => u.id !== action.payload.id)
    case 'USERS_DELETE_ALL':
      return []
    default:
      return state
  }
}

module.exports = {usersReducer}
