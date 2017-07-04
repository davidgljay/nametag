const pubsub = require('./pubsub')
const {errorLog} = require('../../errors')
const {db} = require('../../db')

const NametagSubscription = ({conn}) => db.table('nametags').changes().run(conn)
  .then(feed => {
    feed.each((err, nametag) => {
      if (err) {
        errorLog('Error in nametag subscription feed')
        return
      }
      if (!nametag.new_val) {
        return
      }
      if (!nametag.old_val) {
        pubsub.publish('nametagAdded', nametag.new_val)
      } else if (nametag.old_val.present !== nametag.new_val.present) {
        pubsub.publish('nametagUpdated', {
          id: nametag.new_val.id,
          room: nametag.new_val.room,
          present: nametag.new_val.present
        })
      }
    })
  })

module.exports = NametagSubscription
