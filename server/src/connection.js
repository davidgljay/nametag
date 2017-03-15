const r = require('rethinkdb')

class Connection {
  consructor () {
    console.log('Connection constructor');
    this.conn = null

    this.init = this.init.bind(this)
  }

  init (reqlOptions) {
    return r.connect(reqlOptions, (err, conn) => {
      if (err) {
        throw new Error(`Could not connect to rethinkdb: ${err}`)
      }
      this.conn = conn
    })
  }
}

module.exports = Connection
