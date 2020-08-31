
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

  test('persist model updates to the store', () => {
    const collection = new ReduxCollection()
    collection.fetch({id: 'aela'}) // specific record fetch
    expect(collection.size()).toEqual(1)
    const model = collection.get('aela')
    expect(model.get('firstName')).toEqual('Aela')
    model.set('email', 'aelahunts@companions.org') //
    model.save()
    expect(getUsers(store.getState(), 'ONE_USER', 'aela').email).toEqual('aelahunts@companions.org')
  })

  test('delete a model from the store when model.destroy() is called', () => {
    const collection = new ReduxCollection()
    collection.fetch()
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(3)
    const aela = collection.get('aela')
    aela.destroy()
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(2)
  })

  test('create a new model in the store when model.save() is called', () => {
    const model = new ReduxModel({
      firstName: 'Brelyna',
      lastName: 'Maryon',
      email: 'bmaryon@winterhold.edu'
    })
    model.save()
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(4)
  })

  describe('Connecting a model or collection to the store should', () => {
    test('update the collection with new data when the store changes', () => {
      const collection = new ReduxCollection()
      collection.fetch()
      expect(collection.size()).toEqual(3)
      const cids = collection.map(model => model.cid)
      store.subscribe(() => {
        // merge without changes to old records
        collection.set(getUsers(store.getState(), 'ALL_USERS'))
      })
      const changeCallback = jest.fn()
      collection.at(0).once('change', changeCallback)

      store.dispatch({
        type: 'USERS_ADD',
        payload: {
          firstName: 'Delphine',
          email: 'delphine@sleepinggiantinn.com'
        }
      })
      expect(collection.size()).toEqual(4)
      const cidsAgain = collection.map(model => model.cid)
      cidsAgain.pop()
      expect(cidsAgain).toEqual(cids) // original cids intact
      expect(collection.at(0).changed).toEqual({}) // original models unchanged
      expect(changeCallback).not.toHaveBeenCalled()
    })

    test('update the attributes of a model when the store changes', () => {
      const collection = new ReduxCollection()
      collection.fetch()
      const aela = collection.get('aela')
      store.subscribe(() => {
        aela.set(getUsers(store.getState(), 'ONE_USER', aela.id))
      })
      const changeCallback = jest.fn()
      aela.once('change', changeCallback)

      store.dispatch({
        type: 'USERS_UPDATE',
        payload: {
          id: 'aela',
          firstName: 'Aela',
          lastName: 'the Huntress',
          email: 'aelahunts@companions.org'
        }
      })
      expect(aela.changed).toEqual({email: 'aelahunts@companions.org'})
      expect(aela.get('email')).toEqual('aelahunts@companions.org')
      expect(changeCallback).toHaveBeenCalled()
    })
  })
})
