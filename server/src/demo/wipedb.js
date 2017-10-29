const r = require('rethinkdb')

r.connect({host: 'rethinkdb'})
  .then(conn => {
    r.branch(r.dbList().contains('demo'), r.dbDrop('demo'), null).run(conn)
    .then(() => r.dbCreate('demo').run(conn))
  })
