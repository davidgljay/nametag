module.exports = {
  badges: {
    indexes: []
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
    indexes: ['email', 'facebook', 'twitter', 'google']
  },
  notificationTokens: {
    indexes: ['token']
  },
  notificationReferences: {
    indexes: []
  }
}
