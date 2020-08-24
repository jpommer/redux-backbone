
const Backbone = require('backbone')
const { combineReducers } = require('redux')
const { users, usersPersisted } = require('./test-data')
const { createStore } = require('redux')
const { usersReducer } = require('../reducers')

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
    expect(model.get('firstName')).toEqual('Zoe')
  })
  test('have a store property on it', () => {
    const collection = new ReduxCollection()
    expect(collection.store).toBeDefined()
  })
})

describe('Redux store should', () => {
  afterAll(() => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
  })
  test('be available and receptive to actions', () => {
    const callback = jest.fn()
    store.subscribe(callback)
    console.log(store.getState())
    expect(store.getState().users.length).toEqual(0)
    store.dispatch({type: 'USERS_ADD', payload: users})
    expect(callback).toHaveBeenCalled()
    expect(store.getState().users.length).toEqual(3)
    store.dispatch({type: 'USERS_DELETE', payload: users[0]})
    expect(store.getState().users.length).toEqual(2)
  })
})

describe('ReduxCollection CRUD operations should', () => {
  afterEach(() => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
  })
  test('create a user in the store when saving a model', () => {
    const callback = jest.fn(() => console.log(store.getState()))
    const collection = new ReduxCollection([])
    store.subscribe(callback)
    collection.create({firstName: 'Jack', lastName: 'Davis', email: 'jdavis@gmail.tld'})
    expect(callback).toHaveBeenCalled()
    expect(store.getState().users.length).toEqual(1)
  })

  test('load the collection from the store when fetch is called', () => {
    store.dispatch({type: 'USERS_ADD', payload: usersPersisted})
    expect(store.getState().users.length).toEqual(3)
    const collection = new ReduxCollection()
    collection.fetch()
    expect(collection.size()).toEqual(3)
  })
})
