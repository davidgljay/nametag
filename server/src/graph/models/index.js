const _ = require('lodash')
const r = require('rethinkdb')
const Messages = require('./Messages')
const Nametags = require('./Nametags')
const Rooms = require('./Rooms')
const Badges = require('./Badges')
const Templates = require('./Templates')
const Granters = require('./Granters')
const BadgeRequests = require('./BadgeRequests')
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
    Templates,
    Granters,
    BadgeRequests,
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
      let args
      if (index.fields) {
        args = [
          index.name,
          parseIndexes(index.fields),
          {multi: !!index.multi}
        ]
      } else {
        args = [
          index.name,
          {multi: !!index.multi}
        ]
      }
      r.db('nametag').table(table).indexCreate(...args).run(conn).catch(handleError)
    } else {
      r.db('nametag').table(table).indexCreate(index).run(conn).catch(handleError)
    }
  }
}

const parseIndexes = (fields) => {
  if (fields instanceof Array) {
    return fields.map(field => {
      if (field instanceof Object) {
        return parseIndexes(field)
      }
      return r.row(field)
    })
  } else {
    switch (Object.keys(fields)[0]) {
      case 'notEq':
        return r.row(fields.notEq[0]).not().eq(fields.notEq[1])
      case 'values':
        return r.row(fields.values).values()
      case 'countEq':
        return r.row(fields.countEq[0]).count().eq(fields.countEq[1])
    }
  }
}

const handleError = err => {
  if (err.msg && err.msg.match('already exists')) {
    return
  }
  errorLog('Creating tables and indexes')(err)
}
