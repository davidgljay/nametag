module.exports = {
  '@tags': ['login', 'smparticipant'],
  before: client => {
    const page = client.page.RoomCards()
    const {launchUrl} = client

    client
    .url(launchUrl)

    page
    .ready()
    .waitForElementVisible('#roomCards')
    .getAttribute('.roomCard', 'data-id', (result) => client.url(`${launchUrl}/rooms/${result.value}`))
  },
  'Participant joins a room via social media': client => {
    const {users, room} = client.globals
    const roomPage = client.page.Room()

    roomPage
      .roomJoin(users.smParticipant)

    roomPage
      .assertLoaded(room, users.participant)
  },
  'Participant posts a message': client => {
    const {messages, room, users} = client.globals
    const page = client.page.Room()

    page
      .assertLoaded(room, users.participant)
      .postWelcome(messages[3])
      .postMessage(messages[4])
  },
  after: client => {
    client.end()
  }
}
