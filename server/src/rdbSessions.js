const r = require('rethinkdb')
const cache = require('memory-cache')

module.exports = function (session) {
  const Store = session.Store

  function RethinkStore (options) {
    options = options || {}
    this.conn = options.conn

    if (!this.conn) {
      console.err('Rdb connection is not defined')
      return
    }

    Store.call(this, options)

    this.emit('connect')
    this.sessionTimeout = options.sessionTimeout || 86400000 // 1 day
    this.table = options.table || 'session'
    this.db = options.db || 'sessions'
    this.debug = options.debug || false
    setInterval(function () {
      try {
        r.db(this.db).table(this.table)
          .filter(r.row('expires').lt(r.now().toEpochTime().mul(1000))).delete()
          .run(this.conn)
      } catch (error) {
        console.error(error)
        return null
      }
    }.bind(this), options.flushInterval || 60000)
  }

  RethinkStore.prototype = new Store()

  // Get Session
  RethinkStore.prototype.get = function (sid, fn) {
    var sdata = cache.get('sess-' + sid)
    if (sdata) {
      if (this.debug) { console.log('SESSION: (get)', JSON.parse(sdata.session)) }
      return fn(null, JSON.parse(sdata.session))
    } else {
      r.db(this.db).table(this.table).get(sid).run(this.conn).then(function (data) {
        return fn(null, data ? JSON.parse(data.session) : null)
      }).error(function (err) {
        return fn(err)
      })
    }
  }

  // Set Session
  RethinkStore.prototype.set = function (sid, sess, fn) {
    // if (!sess.passport) {
    //   return fn()
    // }
    var sessionToStore = {
      id: sid,
      expires: new Date().getTime() + (sess.cookie.originalMaxAge || this.sessionTimeout),
      session: JSON.stringify(sess)
    }

    cache.put('sess-' + sid, sessionToStore, 30000)
    r.db(this.db).table(this.table).insert(sessionToStore, { conflict: 'replace', returnChanges: true }).run(this.conn).then(function (data) {
      var sdata = null
      if (data.changes[0] != null) {
        sdata = data.changes[0].new_val || null
      }

      if (sdata) {
        if (this.debug) { console.log('SESSION: (set)', sdata.id) }
      }
      if (typeof fn === 'function') {
        return fn()
      } else {
        return null
      }
    }).error(function (err) {
      return fn(err)
    })
  }

  // Destroy Session
  RethinkStore.prototype.destroy = function (sid, fn) {
    if (this.debug) { console.log('SESSION: (destroy)', sid) }
    cache.del('sess-' + sid)
    r.db(this.db).table(this.table).get(sid).delete().run(this.conn).then(function (data) {
      if (typeof fn === 'function') {
        return fn()
      } else return null
    }).error(function (err) {
      return fn(err)
    })
  }

  return RethinkStore
}
