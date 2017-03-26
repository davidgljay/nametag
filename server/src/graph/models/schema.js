module.exports = {
  badges: {
    indexes: ['template']
  },
  messages: {
    indexes: [
      {name: 'room_recipient', fields: ['room', 'recipient']},
      {name: 'room_author_isDM', fields: ['room', 'author', {notEq: ['recipient', false]}]},
      'author'
    ]
  },
  nametags: {
    indexes: ['room']
  },
  rooms: {
    indexes: ['closedAt']
  },
  users: {
    indexes: [
      'email',
      'facebook',
      'twitter',
      'google',
      {name: 'nametags', fields: {values: 'nametags'}, multi: true}
    ]
  },
  badgeTemplates: {
    indexes: ['granter']
  },
  badgeGranters: {
    indexes: []
  }
}
