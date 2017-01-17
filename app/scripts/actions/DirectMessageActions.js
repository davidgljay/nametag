import errorLog from '../utils/errorLog'
import {hz} from '../api/horizon'
import {addMessageArray} from './MessageActions'
import {setRoomProp} from './RoomActions'
import _ from 'lodash'

let dmSubscriptions = {}

export const postDirectMessage = (message) => {
  return () =>
    new Promise((resolve, reject) => {
      hz('direct_messages').upsert(message).subscribe(resolve, reject)
      .catch(errorLog('Error posting a direct message ' + JSON.stringify(message) + ': '))
    })
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
