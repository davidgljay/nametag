const _ = require('lodash')
const r = require('rethinkdb')
const Messages = require('./Messages')
const Nametags = require('./Nametags')
const Rooms = require('./Rooms')
const Badges = require('./Badges')
const Users = require('./Users')
const schema = require('./schema')

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

  for (let i=0; i < models.length; i++ ) {
    const table = models[i]
    const indexes = schema[models[i]].indexes
    console.log(`Initializing ${table} table and indexes`)
    createTable(conn, table)
      .then(() => createIndexes(conn, table, indexes))
  }
}

// Create a promise that never returns an error, so that the chain continues if
// the DB is already created
const createTable = (conn, table) => new Promise((resolve, reject) =>
  r.db('nametag').tableCreate(table).run(conn)
    .then(resolve)
    .catch(resolve)
  )

const createIndexes = (conn, table, indexes) => {
  const promises = []
  for (let i=0; i < indexes.length; i++ ) {
    const index = indexes[i]
    if (index.name) {
      promises.push(r.db('nametag').table(table).indexCreate(
        index.name,
        index.fields.map(field => {
          return r.row(field)
        })
      ).run(conn))
    } else {
      promises.push(r.db('nametag').table(table).indexCreate(index).run(conn))
    }
  }
  // Return all promises, catch errors caused by indexes that already exist
  return Promise.all(promises).catch(() => {})
}
