const Backbone = require('backbone')
const _ = require('underscore')
const { ListView, ItemView } = require('./list')

const Button = Backbone.Model.extend({})
const Buttons = Backbone.Collection.extend({
  model: Button
})

const initButtonGroupView = (usersCollection, oneuser, users) => {
  // some controls to demonstrate data changes
  const ButtonGroupView = ListView.extend({
    model: Button,
    el: 'div.buttongroup',
    template: _.template('<div></div>'),
    tagName: 'div',
    itemView: ItemView.extend({
      ulfric: oneuser,
      users: usersCollection,
      tagName: 'span',
      template: _.template('<button title="<%= title %>"><%= label %></button>'),
      events: {
        'click button': 'doButton'
      },
      doButton: function() {
        switch (this.model.get('action')) {
          case 'action-add':
            return this.users.add(this.ulfric)
          case 'action-remove':
            return this.users.remove(this.users.get('ulfrics'))
          case 'action-change':
            return this.users.get('aela').set('firstName', 'Sarah')
          case 'action-reset':
            return this.users.set(users)
        }
      }
    })
  })

  return ButtonGroupView
}

module.exports = { initButtonGroupView, Buttons }
