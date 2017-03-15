import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'
import {postDirectMessage} from './DirectMessageActions'

let messageSubscriptions = {}

export const addMessage = (message, id) => {
  return {
    type: constants.ADD_MESSAGE,
    message,
    id
  }
}

export const addMessageArray = (messages) => {
  return {
    type: constants.ADD_MESSAGE_ARRAY,
    messages
  }
}

export const saveMessageAction = (id, saved) => {
  return {
    type: constants.SAVE_MESSAGE,
    id,
    saved
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
export function watchRoomMessages (room) {
  return function (dispatch, getState) {
    return new Promise((resolve, reject) => {
      messageSubscriptions[room] = hz('messages').findAll({room: room}).watch().subscribe(
        (messages) => {
          dispatch(addMessageArray(messages))
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
export function unWatchRoomMessages (room) {
  return function () {
    return messageSubscriptions[room].unsubscribe()
  }
}

/*
* Post a message, highlighting any @mentions. If the message
* starts with d or D, treat it as a DM.
*
* @params
*    message - The message to be posted
*
* @returns
*    promise
*/
export function postMessage (message) {
  return function (dispatch, getState) {
    const updatedMessage = {
      type: 'message',
      ...message,
      text: message.text.indexOf('@') === -1
      ? message.text : highlightMentions(message, getState().nametags)
    }
    const dm = message.text.slice(0, 2).toLowerCase() === 'd '
    const promise = dm ? dispatch(postDirectMessage({...message, type: 'direct_message'}))
    : new Promise((resolve, reject) => {
      hz('messages').upsert(updatedMessage).subscribe(resolve, reject)
    })

    return promise
    .catch(errorLog('Error posting a message ' + JSON.stringify(message) + ': '))
  }
}

const highlightMentions = (message, nametags) => {
  const roomNametags = Object.keys(nametags).map((id) => nametags[id])
    .filter(nametag => nametag.room === message.room)
  let splitMsg = message.text.split('@')
  for (let i = 0; i < splitMsg.length; i++) {
    for (let j = 0; j < roomNametags.length; j++) {
      const text = splitMsg[i]
      const {name} = roomNametags[j]
      if (text.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
        splitMsg[i] = `*@${text.slice(0, name.length)}*${text.slice(name.length)}`
      }
    }
  }
  return splitMsg.join('')
}

/*
* Toggle whether a message is saved. Starred messages will be archived once the room is closed.
*
* @params {string} id - The is of the message to be starred
* @params {boolean} saved - Whether or not the message should be saved
*
* @returns
*    promise
*/

export function saveMessage (id, saved) {
  return (dispatch) => new Promise((resolve, reject) => {
    dispatch(saveMessageAction(id, saved))
    hz('messages').update({id, saved}).subscribe(resolve, reject)
  })
  .catch(errorLog('Error saving message'))
}
