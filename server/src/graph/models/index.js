const _ = require('lodash')
const r = require('rethinkdb')
const Messages = require('./Messages')
const Nametags = require('./Nametags')
const Rooms = require('./Rooms')
const Badges = require('./Badges')
const Users = require('./Users')
const schema = require('./schema')
const {errorLog} = require('../../errors')

module.exports = (context) => {
  // We need to return an object to be accessed.
  return _.merge(...[
    Messages,
    Nametags,
    Rooms,
    Badges,
    Users
  ].map((loaders) => {
    // Each loader is a function which takes the context.
    return loaders(context)
  }))
}

module.exports.init = (conn) => {
  const models = Object.keys(schema)

  for (let i = 0; i < models.length; i++) {
    const table = models[i]
    const indexes = schema[models[i]].indexes
    console.log(`Initializing ${table} table and indexes`)
    createTable(conn, table)
      .then(() => createIndexes(conn, table, indexes))
      .catch(handleError)
  }
}

// Create a promise that never returns an error, so that the chain continues if
// the DB is already created
const createTable = (conn, table) => new Promise((resolve, reject) =>
  r.db('nametag').tableCreate(table).run(conn)
    .then(resolve)
    .catch(err => {
      if (err.msg.match('already exists')) {
        resolve()
      } else {
        reject(err)
      }
    })
  )

// Create indexes, catching errors caused by indexes already existing
const createIndexes = (conn, table, indexes) => {
  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i]
    if (index instanceof Object) {
      r.db('nametag').table(table).indexCreate(
        index.name,
        index.fields.map(field => {
          if (field instanceof Object) {
            switch (Object.keys(field)[0]) {
              case 'notEq':
                return r.row(field.notEq[0]).not().eq(field.notEq[1])
            }
          }
          return r.row(field)
        })
      ).run(conn).catch(handleError)
    } else {
      r.db('nametag').table(table).indexCreate(index).run(conn).catch(handleError)
    }
  }
}

const handleError = err => {
  if (err.msg.match('already exists')) {
    return
  }
  errorLog('Creating tables and indexes')(err)
}
