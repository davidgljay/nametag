import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

let messageSubscriptions = {}

export const addMessage = (message, id) => {
  return {
    type: constants.ADD_MESSAGE,
    message,
    id,
  }
}

/*
* Watch all nametags for a room
*
* @params
*    roomId
*
* @returns
*    promise
*/
// export const getRoomMessages
export function getRoomMessages(room) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      messageSubscriptions[room] = hz('messages').findAll({room: room}).watch().subscribe(
        (messages) => {
          for (let i = 0; i < messages.length; i++) {
            dispatch(addMessage(messages[i], messages[i].id))
          }
          resolve()
        }, reject)
    })
    .catch(errorLog('Error subscribing to messages for room ' + room + ': '))
  }
}
