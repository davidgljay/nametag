import errorLog from '../utils/errorLog'
import {hz} from '../api/horizon'
import {addMessageArray} from './MessageActions'
import {setRoomProp} from './RoomActions'
import _ from 'lodash'

let dmSubscriptions = {}

export const postDirectMessage = (message) => {
  return (dispatch, getState) => {
    let newMessage
    const nametags = getState().nametags
    const roomNametags = Object.keys(nametags).map((id) => nametags[id])
      .filter(nametag => nametag.room === message.room)
    for (let i = 0; i < roomNametags.length; i++ ) {
      const nametag = roomNametags[i]
      if (message.text.slice(2, nametag.name.length + 2).toLowerCase() ===
        nametag.name.toLowerCase()) {
        newMessage = {
          ...message,
          recipient: nametag.id,
          text: message.text.slice(nametag.name.length + 2).trim(),
        }
      }
    }
    return newMessage ? new Promise((resolve, reject) => {
      hz('direct_messages').upsert(newMessage).subscribe(resolve, reject)
    }).catch(errorLog('Error posting a direct message ' + JSON.stringify(message) + ': '))
    : Promise.reject('Cannot send direct message, no one of that name is in this room.')
  }
}

export const watchDirectMessages = (room) => {
  const onDms = (resolve, dispatch, getState) => (dms) => {
    dispatch(addMessageArray(dms.map((dm) => {
      let type
      const currentUserNametag = getState().userNametags[room].nametag
      if (dm.recipient === currentUserNametag) {
        type = 'direct_message_incoming'
      } else if (dm.author === currentUserNametag) {
        type = 'direct_message_outgoing'
      }
      return {...dm, type}
    })))
    const messageIds = _.uniq(
      dms.map((m) => m.id).concat(getState().rooms[room].messages)
    )
    dispatch(setRoomProp(room, 'messages', messageIds))
    resolve()
  }
  dmSubscriptions[room] = []
  return (dispatch, getState) =>
      Promise.all([
        // Get DMs to the current user
        new Promise((resolve, reject) => {
          dmSubscriptions[room][0] = hz('direct_messages')
            .findAll({recipient: getState().userNametags[room].nametag, room})
            .watch().subscribe(onDms(resolve, dispatch, getState), reject)
        }),
        // ... and also from the current user
        new Promise((resolve, reject) => {
          dmSubscriptions[room][1] = hz('direct_messages')
            .findAll({author: getState().userNametags[room].nametag, room})
            .watch().subscribe(onDms(resolve, dispatch, getState), reject)
        }),

      ])
}

export const unWatchDirectMessages = (room) => {
  return () => {
    dmSubscriptions[room][0].unsubscribe()
    dmSubscriptions[room][1].unsubscribe()
  }
}
