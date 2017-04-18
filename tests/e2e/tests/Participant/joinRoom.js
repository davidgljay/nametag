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
    const {users, room} = client.globals
    const roomCardsPage = client.page.RoomCards()
    const roomPage = client.page.Room()

    roomCardsPage
      .registerInRoom(users.participant)
      .joinRoom(users.participant)

    roomPage
      .assertLoaded(room, users.participant)
  },
  'Participant posts a message': client => {
    const {messages, room, users} = client.globals
    const page = client.page.Room()

    page
      .assertLoaded(room, users.participant)
      .postMessage(messages[1])
      .postMessage(messages[2])
  },
  after: client => {
    client.end()
  }
}
