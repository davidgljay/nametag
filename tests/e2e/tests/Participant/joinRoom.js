module.exports = {
  '@tags': ['login', 'participant'],
  before: client => {
    const page = client.page.Room()

    client
    .url('https://localhost:8181/rooms/123456')

    page
    .ready()
  },
  'Participant posts a reply': client => {
    const {messages, room, users} = client.globals
    const page = client.page.Room()

    page
      .agreeToNorms()
      .postWelcome(messages[2])
      .register(users.participant)
      .assertLoaded(room, {name: 'participant'})
      .postReply(messages[3], 1)
  },
  after: client => {
    client.end()
  }
}
