const r = require('rethinkdb')
const errors = require('../../errors')

const table = r.db('nametag').table('notificationReferences')

/**
 * Notification References
 *
 * Used to retrieve tokens from third-party notification providers, such as GCM.
 * Steps must be taken to avoid letting these tokens de-anonymize users, and this
 * seperate table is the beginning of that infrastructure.
 *
 * When one user triggers a notification for another user's nametag, our system has a problem:
 * it's not allowed to associate the nametag receiving the notification with the user's
 * account! To address this, a system of notification tokens and notification references are used.
 *
 * When a user registers a notification token, they post it to this table and recieve a
 * notification reference which is attached to their nametag. Each notification token may
 * have many notification references, one for each nametag, so that a single token ID cannot be used
 * to track users from room to room. A user who wishes to send a notification then
 * sends the notification reference to Nametag's servers along with E2E encrypted notification
 * content, and our system uses the reference to look up the appropriate notification token
 * and transmit the data.
 *
 */

/**
 * Returns a notification token from a reference id.
 *
 * @param {Object} context     graph context
 * @param {String} id   the id of the badge to be retrieved
 *
 */

const getToken = ({conn}, id) => table.get(id).run(conn)

/**
 * Updates or creates a notification token
 *
 * @param {Object} context     graph context
 * @param {String} token   the token to be found or updated
 *
 */

const create = ({conn}, tokenId) => table.insert({token: tokenId}).run(conn)
.then((res) => {
  if (res.errors > 0) {
    return new errors.APIError('Error creating room')
  }
  return {id: res.generated_keys[0]}
)

module.exports = (context) => ({
  notificationReferences: {
    getToken: (id) => getToken(context, id),
    create: (tokenId) => create(context, tokenId)
  }
})
