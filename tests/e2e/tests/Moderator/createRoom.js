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
  after: client => {
    client.end()
  }
}
