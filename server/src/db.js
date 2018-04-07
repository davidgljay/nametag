const r = require('rethinkdb')

let db
let init

const sessionsDBInit = (conn) => r.dbCreate('sessions').run(conn).catch(err => {
    if (err.msg !== 'Database `sessions` already exists.') {
      console.log('err', err)
    }
    return
  })
  .then(() => r.db('sessions').tableCreate('sessions').run(conn)
    .catch(err => {
        if (err.msg !== 'Table `sessions.sessions` already exists.') {
          console.log('err', err)
        }
        return
      })
)

switch (process.env.NODE_ENV) {
  case 'test':
    console.log('Using test database')
    db = r.db('test')
    init = (conn) => r.branch(r.dbList().contains('test'), r.dbDrop('test'), null).run(conn)
    .then(() => r.dbCreate('test').run(conn))
    .then(() => sessionsDBInit(conn))
    break
  case 'demo':
    console.log('Using demo database')
    db = r.db('demo')
    init = (conn) => r.dbCreate('demo').run(conn).catch(err => {
      if (err.msg !== 'Database `demo` already exists.') {
        console.log('err', err)
      }
      return null
    })
    .then(() => sessionsDBInit(conn))
    break
  default:
    console.log('Using dev/production database')
    db = r.db('nametag')
    init = (conn) => r.dbCreate('nametag').run(conn).catch(err => {
      if (err.msg !== 'Database `nametag` already exists.') {
        console.log('err', err)
      }
      return conn
    })
    .then(() => sessionsDBInit(conn))
}

module.exports.db = db
module.exports.dbInit = init
