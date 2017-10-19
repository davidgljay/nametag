const r = require('rethinkdb')
const Context = require('../graph/context')

r.connect({host: 'rethinkdb'})
  .then(conn => {
    console.log('Connecting to rethinkDB')
    const context = new Context(conn)
    context.models.Users.emailDigest()
  })
