import fbase from '../api/firebase'
import errorLog from '../utils/errorLog'
import constants from '../constants'

export const addRoom = (room, key) => {
  return {
    type: constants.ADD_ROOM,
    room,
    key,
  }
}

export const incrementRoomNametagCount = (roomId) => {
  return {
    type: constants.INCREMENT_ROOM_NT_COUNT,
    roomId,
  }
}

/*
* Subscribe to a list of Rooms
*
* @params
*    none
* TODO: add params for filtering and search
*
* @returns
*    Promise
*/
export function subscribe() {
  return function(dispatch) {
    return fbase.child('rooms').on('child_added', function onValue(value) {
      dispatch(addRoom(value.val(), value.key()))
      getNametagCount(value.key())(dispatch)
    }, errorLog('Error subscribing to RoomCards'))
  }
}

/*
* Unsubscribe from a list of Rooms and from Nametag counts for those rooms
*
* @params
*    none
*
* @returns
*    Promise
*/
export function unsubscribe(rooms) {
  return function() {
    fbase.child('rooms').off('child_added')
    for (let id in rooms) {
      if (!rooms.hasOwnProperty(id)) {
        continue
      }
      fbase.child('nametags').child(id).off('child_added')
    }
  }
}

/*
* Get nametag count for a room
*
* TODO: this may violate privacy expecations in some instances, think about how to refactor
* @params
*    none
*
* @returns
*    Promise
*/
export function getNametagCount(roomId) {
  console.log('Getting nametag count for:' + roomId)
  return function(dispatch) {
    return fbase.child('nametags').child(roomId).on('child_added', function() {
      dispatch(incrementRoomNametagCount(roomId))
    }, errorLog('Error counting room Nametags'))
  }
}

