const Backbone = require('backbone')
const _ = require('underscore')
const $ = require('jquery')

const ItemView = Backbone.View.extend({
  template: _.template('Hi there.'),

  initialize: function(options) {
    this.listenTo(this.model, 'change', this.render, this)
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes))
    return this
  }
})

const ListView = Backbone.View.extend({
  template: _.template('Hello'),
  itemView: ItemView,

  initialize: function(options) {
    this.childViews = {}
    this.listenTo(this.collection, 'add', this.makeItemView, this)
    this.listenTo(this.collection, 'remove', this.removeItemView, this)
    console.log('collection', this.collection)
  },

  makeItemView: function(model) {
    const itemview = new (this.itemView)({model})
    $(this.tagName, this.el).append(itemview.render().el)
    this.childViews[model.id] = itemview
    return itemview
  },

  removeItemView: function(model) {
    this.childViews[model.id].remove()
    delete this.childViews[model.id]
  },

  render: function() {
    this.$el.html(this.template())
    this.collection.forEach(model => {
      this.makeItemView(model)
    })
    return this
  }
})

module.exports = {ListView, ItemView}
