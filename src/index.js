const { ListView, ItemView } = require('../views/list')
const Backbone = require('backbone')
const { users } = require('./__test/test-data')
const _ = require('underscore')

const User = Backbone.Model.extend({})
const Users = Backbone.Collection.extend({
  model: User,
})

const usersCollection = new Users(users)

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

// const usersList_3 = new UsersListView({
//   el: 'div.users-collection-3',
//   collection: usersCollection
// })
//
// const usersList_4 = new UsersListView({
//   el: 'div.users-collection-4',
//   collection: new Users(users)
// })

usersList_1.render()
usersList_2.render()
