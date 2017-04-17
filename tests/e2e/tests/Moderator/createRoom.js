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
  'Moderator logs in': client => {
    const {users} = client.globals
    const page = client.page.RoomCards()

    page
      .login(users.mod)
  },
  after: client => {
    client.end()
  }
}
