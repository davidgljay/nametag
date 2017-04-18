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
      .waitForElementVisible('.roomNotif')
      .assert.containsText('.roomTitle', room.title)
  },
  'Moderator enters a room and posts a message': client => {
    const page = client.page.Room()
    const {room, messages, users} = client.globals

    page
      .waitForElementVisible('.roomNotif')
      .click('.roomNotif')
      .assertLoaded(room, users.mod)
      .postMessage(messages[0])

  },
  after: client => {
    client.end()
  }
}
