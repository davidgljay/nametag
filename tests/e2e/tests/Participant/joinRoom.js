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
      .registerInRoom(users.participant)
      .joinRoom(users.participant)
  },
  'Participant posts a message': client => {
    const {messages, room, users} = client.globals
    const page = client.page.Room()

    page
      .updateNametag(users.participant.name)
      .postWelcome(messages[1])
      .assertLoaded(room, users.participant)
      .postMessage(messages[2])
  },
  after: client => {
    client.end()
  }
}
