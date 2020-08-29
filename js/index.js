const Backbone = require('backbone')
const { getUsers } = require('./selectors')

module.exports = function initReduxBackbone(store) {
  Backbone.Collection.mixin({
    store: function(models, iteratee) {
      return store
    }
  })
  Backbone.Model.mixin({
    store: function(models, iteratee) {
      return store
    }
  })

  const ReduxModel = Backbone.Model.extend({
    sync: (method, model, options) => {
      switch(method) {
        case 'create':
          return model.store().dispatch({type: 'USERS_ADD', payload: model.toJSON()})
        case 'read':
          return model.set(getUsers(model.store().getState(), 'ONE_USER', options.id))
        case 'update':
          return model.store().dispatch({type: 'USERS_UPDATE', payload: model.toJSON()})
        default:
          return
      }
    },
    fetch: (response) => {
      console.log('response', response)
      return response
    },
  })

  const ReduxCollection = Backbone.Collection.extend({
    model: ReduxModel,
    sync: (method, collection, options) => {
      switch(method) {
        case 'read':
          const store = collection.store()
          if(options.id) {
            return collection.add(getUsers(store.getState(), 'ONE_USER', options.id))
          } else {
            return collection.reset(getUsers(store.getState(), 'ALL_USERS'))
          }
      }
    }
  })

  return {ReduxModel, ReduxCollection}
}
