const Backbone = require('backbone')

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
          return // call selector here
        case 'update':
          return model.store().dispatch({type: 'USERS_UPDATE', payload: model.toJSON()})
        default:
          return
      }
    }
  })

  const ReduxCollection = Backbone.Collection.extend({
    model: ReduxModel,
    sync: (method, collection, options) => {
      switch(method) {
        case 'read':
          return collection.reset(collection.store().getState().users)
      }
    }
  })

  return {ReduxModel, ReduxCollection}
}
