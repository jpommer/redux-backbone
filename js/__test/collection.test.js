
const Backbone = require('backbone')
const { combineReducers } = require('redux')
const { users, oneuser } = require('./test-data')
const { createStore } = require('redux')
const { usersReducer } = require('../reducers')
const { getUsers } = require('../selectors')

const store = createStore(combineReducers({users: usersReducer}))
const { ReduxCollection, ReduxModel } = require('../index')(store)

describe('ReduxCollection should', () => {
  test('be an instance of a Backbone collection', () => {
    const collection = new ReduxCollection([])
    expect(collection).toBeInstanceOf(Backbone.Collection)
  })
  test('load users in the constructor and act like a collection', () => {
    const collection = new ReduxCollection(users)
    expect(collection.size()).toEqual(3)
  })
  test('return a ReduxModel', () => {
    const collection = new ReduxCollection(users)
    const model = collection.at(2)
    expect(model).toBeInstanceOf(ReduxModel)
    expect(model).toBeInstanceOf(Backbone.Model)
    expect(model.get('firstName')).toEqual('Balgruuf')
  })
  test('have a store property on it', () => {
    const collection = new ReduxCollection()
    expect(collection.store).toBeDefined()
  })
})

describe('ReduxCollection CRUD operations should', () => {
  afterEach(() => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
  })
  test('create a user in the store when saving a model', () => {
    const callback = jest.fn()
    const collection = new ReduxCollection([])
    store.subscribe(callback)
    collection.create({firstName: 'Jack', lastName: 'Davis', email: 'jdavis@gmail.tld'})
    expect(callback).toHaveBeenCalled()
    expect(store.getState().users.length).toEqual(1)
  })

  test('load the collection from the store when fetch is called', () => {
    store.dispatch({type: 'USERS_ADD', payload: users})
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(3)
    const collection = new ReduxCollection()
    collection.fetch()
    expect(collection.size()).toEqual(3)
  })
})

describe('ReduxModel CRUD operations should', () => {
  beforeEach(() => {
    store.dispatch({type: 'USERS_ADD', payload: users})
  })
  afterEach(() => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
  })
  test('persist updates to a model to the store', () => {
    // expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(3)
    const collection = new ReduxCollection()
    collection.fetch({id: 'aela'}) // specific record fetch
    expect(collection.size()).toEqual(1)
    const model = collection.get('aela')
    expect(model.get('firstName')).toEqual('Aela')
    model.set('email', 'aelahunts@companions.org') //
    model.save()
    expect(getUsers(store.getState(), 'ONE_USER', 'aela').email).toEqual('aelahunts@companions.org')
  })
})
