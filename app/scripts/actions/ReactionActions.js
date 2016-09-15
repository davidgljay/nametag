import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

let reactionSubscriptions = {}


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
* Watch to reactions for a message
*
* @params
*    message - The id of the message to be watched
*
* @returns
*    Promise resolving to reactions
*/
export function watchMessageReactions(message) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      reactionSubscriptions[message] = hz('reactions')
        .findAll({message: message}).watch().subscribe(
          (reactions) => {
            for (let i = 0; i < reactions.length; i++) {
              dispatch({
                type: constants.ADD_REACTION,
                reaction: reactions[i],
              })
            }
            resolve(reactions)
          }, reject)
    })
    .catch(errorLog('Error subscribing to message reactions ' + message + ': '))
  }
}

/*
* Unwatch to reactions for a message
*
* @params
*    message - Id of the message to stop watching
*
* @returns
*    nonre
*/
export function unWatchMessageReactions(message) {
  return () => {
    return reactionSubscriptions[message].unsubscribe()
  }
}
