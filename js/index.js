const Backbone = require('backbone')
const { getUsers } = require('./selectors')

module.exports = function initReduxBackbone(store) {
  // const getState = () => store.getState()

  Backbone.Collection.mixin({
    store: () => store,
    getState: function() { return store.getState() }
  })

  const ReduxModel = Backbone.Model.extend({
    sync: (method, model, options) => {
      switch(method) {
        case 'create':
          return store.dispatch({type: 'USERS_ADD', payload: model.toJSON()})
        case 'read':
          return model.set(getUsers(this.getState(), 'ONE_USER', options.id))
        case 'update':
          return store.dispatch({type: 'USERS_UPDATE', payload: model.toJSON()})
        case 'delete':
          return store.dispatch({type: 'USERS_DELETE', payload: model.attributes})
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
          if(options.id) {
            return collection.add(getUsers(collection.getState(), 'ONE_USER', options.id))
          } else {
            return collection.reset(getUsers(collection.getState(), 'ALL_USERS'))
          }
      }
    }
  })

  return {ReduxModel, ReduxCollection}
}
