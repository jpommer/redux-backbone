const Backbone = require('backbone')
const { combineReducers } = require('redux')
const { createStore } = require('redux')
const { spellsReducer, usersReducer } = require('./reducers')
const { getSpells, getUsers } = require('./selectors')

const store = createStore(combineReducers({spells: spellsReducer, users: usersReducer}))

Backbone.Collection.mixin({
  getStore: () => store,
  getState: function() { return store.getState() }
})
Backbone.Model.mixin({
  getStore: () => store,
  getState: function() { return store.getState() }
})

module.exports = store
