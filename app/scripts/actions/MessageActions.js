import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'
import {setRoomProp} from './RoomActions'

let messageSubscriptions = {}

export const addMessage = (message, id) => {
  return {
    type: constants.ADD_MESSAGE,
    message,
    id,
  }
}

export const addMessageArray = (messages) => {
  return {
    type: constants.ADD_MESSAGE_ARRAY,
    messages,
  }
}

/*
* Watch all messages for a room
*
* @params
*    room - The ID of the room from which to retrieve messages
*
* @returns
*    promise
*/
export function watchRoomMessages(room) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      messageSubscriptions[room] = hz('messages').findAll({room: room}).watch().subscribe(
        (messages) => {
          let messageIds = []
          messages.sort((a, b) => {
            return a.timestamp - b.timestamp
          })
          for (let i = 0; i < messages.length; i++) {
            messageIds.push(messages[i].id)
          }
          dispatch(addMessageArray(messages))
          dispatch(setRoomProp(room, 'messages', messageIds))
          resolve()
        }, reject)
    })
    .catch(errorLog('Error subscribing to messages for room ' + room + ': '))
  }
}

/*
* Unwatch all messages for a room
*
* @params
*    room - The ID of the room from which to retrieve messages
*
* @returns
*    promise
*/
export function unWatchRoomMessages(room) {
  return function() {
    return messageSubscriptions[room].unsubscribe()
  }
}

/*
* Post a message
*
* @params
*    message - The message to be posted
*
* @returns
*    promise
*/
export function postMessage(message) {
  return function() {
    return new Promise((resolve, reject) => {
      hz('messages').upsert(message).subscribe(
        (id) => {
          resolve(id)
        }, reject)
    })
    .catch(errorLog('Error posting a message ' + JSON.stringify(message) + ': '))
  }
}
