import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

let certificateSubscriptions = {}


/*
* Add a reaction to a message
*
* @params
*   reaction- The reaction to be posted, should contain:
*     -eomji: The emoji to be posted
*     -room: The id of the room (used for indexing)
*     -message: The id of the message being reacted to
*     -nametag: The id of the nametag of the user posting the reaction
*
* @returns
*    Promise resolving to the Id of the new reaction
*/
export const addReaction = (reaction) => {
  return () => {
    return new Promise((resolve, reject) => {
      hz('reactions').insert(reaction)
        .subscribe((res) => {
          resolve(res)
        }, reject)
    }).catch(errorLog('Adding reaction to message ' + reaction.message))
  }
}

/*
* Deletes a reaction to a message
*
* @params
*   reactionId- The id of the reaction to be deleted
*
* @returns
*    Promise resolving to the result from horizon
*/
export const removeReaction = (reactionId) => {
  return () => {
    return new Promise((resolve, reject) => {
      hz('reactions').find(reactionId).delete()
        .subscribe((res) => {
          resolve(res)
        }, reject)
    }).catch(errorLog('Removing reaction ' + reactionId))
  }
}

/*
* Subscribe to reactions for a room
*
* @params
*    none
*
* @returns
*    Promise
*/
export function fetch(certificateId) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      certificateSubscriptions[certificateId] = hz('certificates')
        .find(certificateId).fetch().subscribe(
          (certificate) => {
            if (certificate) {
              resolve(dispatch(addCertificate(certificate, certificateId)))
            } else {
              reject('Certificate not found')
            }
          },
          (err) => {
            reject(err)
          })
    })
    .catch(errorLog('Error subscribing to certificate ' + certificateId + ': '))
  }
}
