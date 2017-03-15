const schema = require('./schema')
const Context = require('./context')

module.exports = {
  createGraphOptions: (conn) => (req) => {
    if (!conn) {
      return new Error('No connection to rethinkdb')
    }
    return {
      // Schema is created already, so just include it.
      schema,

      // Load in the new context here, this'll create the loaders + mutators for
      // the lifespan of this request. Also pass in the rethinkdb connection.
      context: new Context(req, conn)
    }
  }
}
