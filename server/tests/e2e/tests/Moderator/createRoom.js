module.exports = {
  '@tags': ['moderator', 'comments', 'commenter'],
  before: client => {
    const embedStreamPage = client.page.embedStreamPage();
    const {users} = client.globals

    embedStreamPage
      .navigate()
      .ready()
  },
  'Moderator logs in and creates a room': client => {
    
  }
