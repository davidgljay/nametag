import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'
import {setRoomProp} from './RoomActions'
import {postDirectMessage} from './DirectMessageActions'
import _ from 'lodash'

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
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      messageSubscriptions[room] = hz('messages').findAll({room: room}).watch().subscribe(
        (messages) => {
          dispatch(addMessageArray(messages))
          const messageIds = _.uniq(
            messages.map((m) => m.id).concat(getState().rooms[room].messages)
          )
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
* Post a message, highlighting any @mentions. If the message
* starts with d or D, treat it as a DM.
*
* @params
*    message - The message to be posted
*
* @returns
*    promise
*/
export function postMessage(message) {
  return function(dispatch, getState) {
    const updatedMessage =  {
      ...message,
      text: message.text.indexOf('@') === -1 ?
        message.text : highlightMentions(message, getState().nametags),
    }
    const dm = message.text.slice(0, 1).toLowerCase() === 'd'
    const promise = dm ? dispatch(postDirectMessage({...message, type: 'direct_message'})) :
    new Promise((resolve, reject) => {
      hz('messages').upsert(updatedMessage).subscribe(resolve, reject)
    })

    // let tempId = new Date().getTime() + '_tempId'
    // addMessage(Object.assign({}, message, {id: tempId}), tempId)
    // addRoomMessage(message.room, tempId)
    return promise
    .catch(errorLog('Error posting a message ' + JSON.stringify(message) + ': '))
  }
}

const highlightMentions = (message, nametags) => {
  const roomNametags = Object.keys(nametags).map((id) => nametags[id])
    .filter(nametag => nametag.room === message.room)
  let splitMsg = message.text.split('@')
  for (let i = 0; i < splitMsg.length; i++ ) {
    for (let j = 0; j < roomNametags.length; j++ ) {
      const text = splitMsg[i]
      const {name} = roomNametags[j]
      if (text.slice(0, name.length).toLowerCase() === name.toLowerCase()) {
        splitMsg[i] = `*@${text.slice(0, name.length)}*${text.slice(name.length)}`
      }
    }
  }
  return splitMsg.join('')
}
