import errorLog from '../utils/errorLog'
import {hz} from '../api/horizon'
import {addMessageArray} from './MessageActions'
import {setRoomProp} from './RoomActions'
import _ from 'lodash'

let dmSubscriptions = {}

export const postDirectMessage = (message) => {
  return (dispatch, getState) => {
    let recipient
    const nametags = getState().nametags
    const roomNametags = Object.keys(nametags).map((id) => nametags[id])
      .filter(nametag => nametag.room === message.room)
    for (let i = 0; i < roomNametags.length; i++ ) {
      const nametag = roomNametags[i]
      if (message.text.slice(2, nametag.name.length + 2).toLowerCase() ===
        nametag.name.toLowerCase()) {
        recipient = nametag.id
      }
    }
    return recipient ? new Promise((resolve, reject) => {
      hz('direct_messages').upsert({...message, recipient}).subscribe(resolve, reject)
      .catch(errorLog('Error posting a direct message ' + JSON.stringify(message) + ': '))
    }) : Promise.reject('Cannot send direct message, no one of that name is in this room.')
  }
}

export const watchDirectMessages = (room) => {
  return (dispatch, getState) =>
      new Promise((resolve, reject) => {
        dmSubscriptions[room] = hz('direct_messages')
          .findAll({user: getState().user.id, room}).watch().subscribe((dms) => {
            dispatch(addMessageArray(dms))
            const messageIds = _.uniq(
              dms.map((m) => m.id).concat(getState().rooms[room].messages)
            )
            dispatch(setRoomProp(room, 'messages', messageIds))
            resolve()
          }, reject)
      })
}

export const unWatchDirectMessages = (room) => {
  return () =>
    dmSubscriptions[room].unsubscribe()
}
