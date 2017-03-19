const models = require('./models')

/**
 * Stores the request context.
 */

 // TODO: Add conn
class Context {
  constructor ({user = null}, conn) {
    // Load the current logged in user to `user`, otherwise this'll be null.
    if (user) {
      this.user = user
    }

    // Include a connection to rethinkDB
    if (conn) {
      this.conn = conn
    }

    // Create the models.
    this.models = models(this)
  }
}

module.exports = Context
