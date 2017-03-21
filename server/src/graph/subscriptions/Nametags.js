const pubsub = require('./pubsub')
const {APIError, errorLog} = require('../../errors')
const r = require('rethinkdb')

const NametagSubscription = conn => r.db('nametag').table('nametags').changes().run(conn)
  .then(feed => {
    feed.each((err, nametag) => {
      if (err) {
        errorLog(new APIError('Error in nametag subscription feed'))
        return
      }
      if (!nametag.old_val) {
        pubsub.publish('nametagAdded', nametag.new_val)
      } else if (nametag.old_val.present !== nametag.new_val.present) {
        pubsub.publish('nametagPresence', {
          id: nametag.new_val.id,
          present: nametag.new_val.present,
          room: nametag.new_val.room
        })
      }
    })
  })

module.exports = NametagSubscription
