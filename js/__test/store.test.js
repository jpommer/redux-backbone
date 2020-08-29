const { combineReducers } = require('redux')
const { users, oneuser } = require('./test-data')
const { createStore } = require('redux')
const { usersReducer } = require('../reducers')
const { getUsers } = require('../selectors')

const store = createStore(combineReducers({users: usersReducer}))

describe('Redux store should', () => {
  test('be available and have initial state', () => {
    expect(store.getState().users.length).toEqual(0)
  })
})

describe('The reducers should', () => {
  test('add a batch of users', () => {
    store.dispatch({type: 'USERS_ADD', payload: users})
    expect(store.getState().users.length).toEqual(3)
  })
  test('add a single user', () => {
    store.dispatch({type: 'USERS_ADD', payload: oneuser})
    expect(store.getState().users.length).toEqual(4)
  })
  test('not add duplicate users', () => {
    store.dispatch({type: 'USERS_ADD', payload: oneuser})
    expect(store.getState().users.length).toEqual(4)
  })
  test('update a user', () => {
    const changedUser = Object.assign(oneuser, {email: 'highking@windhelm.gov'})
    store.dispatch({type: 'USERS_UPDATE', payload: changedUser})
    expect(store.getState().users.length).toEqual(4)
    const foundUser = store.getState().users.filter(u => u.id === 'ulfrics')
    expect(foundUser.length).toEqual(1)
    expect(foundUser[0].email).toEqual('highking@windhelm.gov')
  })
  test('delete a user', () => {
    const getJarl = () => {
      return store.getState().users.filter(u => u.id === 'balgruuf')
    }
    const balgruuf = getJarl()[0]
    expect(balgruuf.id).toEqual('balgruuf')
    store.dispatch({type: 'USERS_DELETE', payload: balgruuf})
    expect(store.getState().users.length).toEqual(3)
    expect(getJarl().length).toEqual(0)
  })
  test('delete all users', () => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
    expect(store.getState().users.length).toEqual(0)
  })
})

describe('The selectors should', () => {
  beforeAll(() => {
    store.dispatch({type: 'USERS_ADD', payload: users})
  })
  afterAll(() => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
  })
  test('find all users', () => {
    const gotUsers = getUsers(store.getState(), 'ALL_USERS')
    expect(gotUsers.length).toEqual(3)
    expect(gotUsers).toEqual(users)
  })
  test('find one user by id', () => {
    const gotJarl = getUsers(store.getState(), 'ONE_USER', 'balgruuf')
    expect(gotJarl).toBeDefined()
    expect(gotJarl).toEqual(users[2])
  })
})
