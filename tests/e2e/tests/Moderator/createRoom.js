module.exports = {
  '@tags': ['login', 'MODERATOR'],
  before: client => {
    const page = client.page.RoomCards()
    const {launchUrl} = client

    client
    .url(launchUrl)

    page
    .ready()
  },
  'Moderator registers and logs in': client => {
    const {users} = client.globals
    const page = client.page.RoomCards()

    page
      .register(users.mod)
  },
  'Moderator creates a room': client => {
    const page = client.page.CreateRoom()
    const {room, users} = client.globals

    page
      .click('#createRoomButton')
      .createRoom(room, users.mod)
      .waitForElementVisible('#room')
  },
  'Moderator enters a room and posts a message': client => {
    const page = client.page.Room()
    const {room, messages, users} = client.globals

    page
      .assertLoaded(room, users.mod)
      .postWelcome(messages[0])
  },
  'Moderator exits and re-enters the room': client => {
    const page = client.page.Room()
    const {room} = client.globals

    page
      .exitRoom()
      .waitForElementVisible('.roomNotif')
      .assert.containsText('.roomTitle', room.title)
      .click('.roomNotif')
  },
  'Moderator posts a message': client => {
    const page = client.page.Room()
    const {room, messages, users} = client.globals

    page
      .assertLoaded(room, users.mod)
      .postMessage(messages[1])
  },
  after: client => {
    client.end()
  }
}
