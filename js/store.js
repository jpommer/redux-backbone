
// reducer
function people(state = [], action) {
  switch (action.type) {
    case 'PEOPLE_ADD':
      return state.concat(action.payload)
    case 'PEOPLE_UPDATE':
      const idx = state.indexOf(action.payload)
      const front = state.slice(0,idx)
      const back = state.slice(idx+1, state.length)
      front.push(action.payload)
      return front.concat(back)
    case 'PEOPLE_DELETE':
      const index = state.indexOf(action.payload)
      return state.slice(0, index).concat(state.slice(index + 1, state.length))
    case 'PEOPLE_DELETE_ALL':
      return state.slice(0,0)
    default:
      return state
  }
}

module.exports = people
