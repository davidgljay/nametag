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
        pubsub.publish('nametagUpdated', nametag.new_val)
      } else if (nametag.old_val.latestVisit === nametag.new_val.latestVisit) {
        pubsub.publish('nametagUpdated', nametag.new_val)
      }
    })
  })

module.exports = NametagSubscription
