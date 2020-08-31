const Backbone = require('backbone')
const { getUsers } = require('./selectors')

module.exports = function initReduxBackbone(store) {

  Backbone.Collection.mixin({
    getStore: () => store,
    getState: function() { return store.getState() }
  })
  Backbone.Model.mixin({
    getStore: () => store,
    getState: function() { return store.getState() }
  })

  const ReduxModel = Backbone.Model.extend({
  })

  const ReduxCollection = Backbone.Collection.extend({
    model: ReduxModel,
  })

  return {ReduxModel, ReduxCollection}
}
