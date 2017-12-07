module.exports = {
  '@tags': ['login', 'participant'],
  before: client => {
    const page = client.page.RoomCards()
    const {launchUrl} = client

    client
    .url(launchUrl)

    page
    .ready()
  },
  'Participant registers and joins a room': client => {
    const {users} = client.globals
    const roomCardsPage = client.page.RoomCards()

    roomCardsPage
      .joinRoom(users.participant)
  },
  'Participant posts a reply': client => {
    const {messages, room, users} = client.globals
    const page = client.page.Room()

    page
      .agreeToNorms()
      .postWelcome(messages[2])
      .register(users.participant)
      .assertLoaded(room, {name: 'participant'})
      .postReply(messages[3])
  },
  after: client => {
    client.end()
  }
}
