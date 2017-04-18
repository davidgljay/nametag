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
    const createRoomPage = client.page.CreateRoom()

    createRoomPage
      .click('#createRoomButton')
      .creatRoom({
        title: 'Test Room',
        description: 'A test room',
        imageSearch: 'room',
        norm: 'A test norm',
        name: 'Test name',
        bio: 'Test bio'
      })
      .waitForElementVisible('.roomNotif')
      .assert.containsText('.roomTitle', 'Test Room')
  },
  after: client => {
    client.end()
  }
}
