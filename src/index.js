const { ListView, ItemView } = require('../views/list')
const Backbone = require('backbone')
const { users, oneuser } = require('./__test/test-data')
const _ = require('underscore')

const User = Backbone.Model.extend({})
const Users = Backbone.Collection.extend({
  model: User,
})
const usersCollection = new Users(users)

const Button = Backbone.Model.extend({})
const Buttons = Backbone.Collection.extend({
  model: Button
})

const ButtonGroupView = ListView.extend({
  model: Button,
  el: 'div.buttongroup',
  template: _.template('<div></div>'),
  tagName: 'div',
  itemView: ItemView.extend({
    ulfric: oneuser,
    users: usersCollection,
    tagName: 'span',
    template: _.template('<button><%= label %></button>'),
    events: {
      'click button': 'doButton'
    },
    doButton: function() {
      switch (this.model.get('klass')) {
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


const UserItemView = ItemView.extend({
  tagName: 'li',
  template: _.template('<%= firstName %> <%= lastName %>')
})

const UsersListView = ListView.extend({
  el: 'div.users-collection-1',
  template: _.template('<ul></ul>'),
  tagName: 'ul',
  itemView: UserItemView
})


const usersList_1 = new UsersListView({
  collection: usersCollection
})
usersList_1.render()

const buttonCollection = new Buttons(
  [
    {label: 'Add Ulfric', klass: 'action-add'},
    {label: 'Remove Ulfric', klass: 'action-remove'},
    {label: 'Aela to Sarah', klass: 'action-change'},
    {label: 'Reset', klass: 'action-reset'}
  ]
)
const buttonsList = new ButtonGroupView({
  collection: buttonCollection
})
buttonsList.render()


const UserEmailItemView = UserItemView.extend({
  template: _.template('<%= firstName %> - <a href="mailto:<%= email %>"><%= email %></a>'),
})

const UsersEmailsListView = UsersListView.extend({
  el: 'div.users-collection-2',
  itemView: UserEmailItemView
})

const usersList_2 = new UsersEmailsListView({
  collection: usersCollection,
})


usersList_2.render()
