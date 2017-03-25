module.exports = {
  badges: {
    indexes: []
  },
  messages: {
    indexes: [{name: "room_recipient", fields:["room", "recipient"]}, 'author']
  },
  nametags: {
    indexes: ['room']
  },
  rooms: {
    indexes: ['closedAt']
  },
  users: {
    indexes: ['email', 'facebook', 'twitter', 'google']
  }
}
