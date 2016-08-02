import fbase from '../api/firebase'
import hz from '../api/horizon'
import errorLog from '../utils/errorLog'
import constants from '../constants'

const roomsDb = hz('rooms')
let roomSubscription
let nametagSubscriptions = []

export const addRoom = (room, key) => {
  return {
    type: constants.ADD_ROOM,
    room,
    key,
  }
}

export const setRoomNametagCount = (roomId, nametagCount) => {
  return {
    type: constants.SET_ROOM_NT_COUNT,
    roomId,
    nametagCount,
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
*    Promise resolving to list of rooms
*/
export function subscribe() {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      roomSubscription = roomsDb.watch().subscribe(
        (rooms) => {
          for (let i = rooms.length - 1; i >= 0; i--) {
            dispatch(addRoom(rooms[i], rooms[i].id))
            getNametagCount(rooms[i].id)(dispatch)
          }
          resolve(rooms)
        },
        (err) => {
          errorLog('Subscribing to rooms: ')(err)
          reject(err)
        })
    })
  }
}

/*
* Unsubscribe from a list of Rooms and from Nametag counts for those rooms
*
* @params
*    none
*
* @returns
*    none
*/
export function unsubscribe() {
  return function() {
    if (roomSubscription) {
      roomSubscription.unsubscribe()
      for (let id in nametagSubscriptions) {
        if (!Object.hasOwnProperty()) {
          continue
        }
        nametagSubscriptions[id].unsubscribe()
      }
    } else {
      errorLog('Tried to unsubscribe from rooms before subscribing')
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
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      nametagSubscriptions.push(hz('nametags').watch(roomId).subscribe(
          (nametags) => {
            resolve(dispatch(setRoomNametagCount(roomId, nametags.length)))
          },
          (err) => {
            errorLog('Getting nametag count ')(err)
            reject(err)
          }
        ))
    })
  }
}

