
const Backbone = require('backbone')
const { combineReducers } = require('redux')
const { oneuser, spells, users } = require('./test-data')
const { createStore } = require('redux')
const { spellsReducer, usersReducer } = require('../reducers')
const { getSpells, getUsers } = require('../selectors')

const store = createStore(combineReducers({spells: spellsReducer, users: usersReducer}))

Backbone.Collection.mixin({
  getStore: () => store,
  getState: function() { return store.getState() }
})
Backbone.Model.mixin({
  getStore: () => store,
  getState: function() { return store.getState() }
})

const ReduxModel = Backbone.Model.extend({})
const ReduxCollection = Backbone.Collection.extend({model: ReduxModel})

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

  test('have a store getter and state getter on it', () => {
    const collection = new ReduxCollection()
    expect(collection.getStore).toBeDefined()
    expect(collection.getState).toBeDefined()
  })
})

const usersModelSync = (method, model, options) => {
  switch(method) {
    case 'create':
      return model.getStore().dispatch({type: 'USERS_ADD', payload: model.toJSON()})
    case 'read':
      return model.set(getUsers(model.getState(), 'ONE_USER', options.id))
    case 'update':
      return model.getStore().dispatch({type: 'USERS_UPDATE', payload: model.toJSON()})
    case 'delete':
      return model.getStore().dispatch({type: 'USERS_DELETE', payload: model.attributes})
    default:
      return
  }
}

const usersCollectionSync = (method, collection, options) => {
  switch(method) {
    case 'read':
      if(options.id) {
        return collection.add(getUsers(collection.getState(), 'ONE_USER', options.id))
      } else {
        return collection.reset(getUsers(collection.getState(), 'ALL_USERS'))
      }
  }
}

const User = Backbone.Model.extend({
  sync: usersModelSync
})
const Users = Backbone.Collection.extend({
  model: User,
  sync: usersCollectionSync
})

describe('The Users collection CRUD operations should', () => {
  afterEach(() => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
  })

  test('create a user in the store when saving a model', () => {
    const callback = jest.fn()
    const collection = new Users([])
    store.subscribe(callback)
    collection.create({firstName: 'Jack', lastName: 'Davis', email: 'jdavis@gmail.tld'})
    expect(callback).toHaveBeenCalled()
    expect(store.getState().users.length).toEqual(1)
  })

  test('load the collection from the store when fetch is called', () => {
    store.dispatch({type: 'USERS_ADD', payload: users})
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(3)
    const collection = new Users()
    collection.fetch()
    expect(collection.size()).toEqual(3)
  })
})

describe('The User model CRUD operations should', () => {
  beforeEach(() => {
    store.dispatch({type: 'USERS_ADD', payload: users})
  })
  afterEach(() => {
    store.dispatch({type: 'USERS_DELETE_ALL'})
  })

  test('persist model updates to the store', () => {
    const collection = new Users()
    collection.fetch({id: 'aela'}) // specific record fetch
    expect(collection.size()).toEqual(1)
    const model = collection.get('aela')
    expect(model.get('firstName')).toEqual('Aela')
    model.set('email', 'aelahunts@companions.org') //
    model.save()
    expect(getUsers(store.getState(), 'ONE_USER', 'aela').email).toEqual('aelahunts@companions.org')
  })

  test('delete a model from the store when model.destroy() is called', () => {
    const collection = new Users()
    collection.fetch()
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(3)
    const aela = collection.get('aela')
    aela.destroy()
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(2)
  })

  test('create a new model in the store when model.save() is called', () => {
    const model = new User({
      firstName: 'Brelyna',
      lastName: 'Maryon',
      email: 'bmaryon@winterhold.edu'
    })
    model.save()
    expect(getUsers(store.getState(), 'ALL_USERS').length).toEqual(4)
  })

  describe('Externally connecting a model or collection to the store should', () => {
    test('update the collection with new data when the store changes', () => {
      const collection = new Users()
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
      const collection = new Users()
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

  describe('The Spells collection should', () => {
    beforeEach(() => {
      store.dispatch({type: 'SPELLS_ADD', payload: spells})
    })
    afterEach(() => {
      store.dispatch({type: 'SPELLS_DELETE_ALL'})
    })
    const spellCollectionSync = (method, collection, options) => {
      switch(method) {
        case 'read':
          return collection.reset(getSpells(collection.getState(), 'ALL_SPELLS'))
      }
    }

    test('have access to the selectors and the store', () => {
      const Spell = Backbone.Model.extend({})
      const Spells = Backbone.Collection.extend({
        model: Spell,
        sync: spellCollectionSync,
      })
      const spells = new Spells()
      spells.fetch()
      expect(spells.getStore).toBeDefined()
      expect(spells.getState).toBeDefined()
      expect(spells).toBeInstanceOf(Backbone.Collection)
      expect(spells.size()).toBe(3)
      expect(spells.at(0)).toBeInstanceOf(Backbone.Model)
      expect(spells.at(2).get('name')).toEqual('Conjure Storm Atronach')
    })

    test('respond to changes in the store when connected via its initialize function', () => {
      const Spell = Backbone.Model.extend({})
      const Spells = Backbone.Collection.extend({
        model: Spell,
        sync: spellCollectionSync,
        initialize: function(options) {
          this.getStore().subscribe(() => {
            this.set(getSpells(this.getState('ALL_SPELLS')))
          })
        }
      })
      const spells = new Spells()
      spells.fetch()
      expect(spells.size()).toEqual(3)
      store.dispatch({
        type:'SPELLS_ADD',
        payload: {
          id: 4,
          name: 'Bound Bow',
          level: 'Adept',
          description: 'Creates a magic bow for 120 seconds. Sheathe it to dispel.'
        }
      })
      expect(spells.size()).toEqual(4)
      store.dispatch({
        type: 'SPELLS_DELETE',
        payload: {
          id: 4
        }
      })
      expect(spells.size()).toEqual(3)
    })
  })
})
