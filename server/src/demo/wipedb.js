const r = require('rethinkdb')

console.log('Wiping demo db')
r.connect({host: 'rethinkdb'})
  .then(conn => {
    console.log('Connected to demo DB')
    return r.branch(r.dbList().contains('demo'), r.dbDrop('demo'), null).run(conn)
    .then(() => r.dbCreate('demo').run(conn))
    .then(() => {
      console.log('DB Wiped')
      process.exit()
    })
  })
