const Backbone = require('backbone')
const _ = require('underscore')
const { ListView, ItemView } = require('../views/list')
const { users, oneuser } = require('./__test/test-data')

// Users data containers
const User = Backbone.Model.extend({})
const Users = Backbone.Collection.extend({
  model: User,
})
const usersCollection = new Users(users)

// buttons
const { initButtonGroupView } = require('../views/buttongroup')
const { Buttons } = require('../views/buttongroup')

const buttonCollection = new Buttons(
  [
    {label: 'Add Ulfric', action: 'action-add', show: true},
    {label: 'Remove Ulfric', action: 'action-remove', show: true},
    {label: 'Aela to Sarah', action: 'action-change', show: true},
    {label: 'Reset', action: 'action-reset', show: true}
  ]
)
const ButtonGroupView = initButtonGroupView(usersCollection, oneuser, users)
const buttonsList = new ButtonGroupView({
  collection: buttonCollection
})
buttonsList.render()

// display the users' names from the Users collection
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


// display firstname and email from the users collection
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

// another view of the users collection, but not the same instance of it
const UserLocation = UserItemView.extend({
  template: _.template('<%= firstName %> <%= lastName %> lives in <%= location %>')
})
const UserLocations = UsersListView.extend({
  el: 'div.users-collection-3',
  itemView: UserLocation
})
const usersList_3 = new UserLocations({
  collection: new Users(users) // OH NO!! This is why people hate Backbone!
})
usersList_3.render()
