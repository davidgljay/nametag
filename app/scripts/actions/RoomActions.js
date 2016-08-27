import {hz} from '../api/horizon'
import errorLog from '../utils/errorLog'
import constants from '../constants'
import {addNametag} from './NametagActions'

let roomSubscription
let nametagSubscriptions = []

export function addRoom(room, id) {
  return {
    type: constants.ADD_ROOM,
    room,
    id,
  }
}

export function setRoomNametagCount(roomId, nametagCount) {
  return {
    type: constants.SET_ROOM_NT_COUNT,
    roomId,
    nametagCount,
  }
}

export function addNametagCert(cert, roomId) {
  return {
    type: constants.ADD_USER_NT_CERT,
    cert,
    roomId,
  }
}

export function removeNametagCert(certId, roomId) {
  return {
    type: constants.REMOVE_USER_NT_CERT,
    certId,
    roomId,
  }
}

export function updateNametag(roomId, property, value) {
  return {
    type: constants.UPDATE_USER_NAMETAG,
    roomId,
    property,
    value,
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
      roomSubscription = hz('rooms').watch().subscribe(
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
*    roomId- the id of the room to get the nametag count for
*
* @returns
*    Promise
*/
export function getNametagCount(roomId) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      nametagSubscriptions.push(hz('nametags').findAll({room: roomId}).watch().subscribe(
          (nametags) => {
            resolve(dispatch(setRoomNametagCount(roomId, nametags.length)))
          }, reject)
        )
    }).catch(errorLog('Error joining room'))
  }
}

/*
* Join a room
*
* @params
*   roomId - The room to join
*   nametag - The nametag with which to join the room
*
* @returns
*   Promise
*/
export function joinRoom(nametag) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      // Need to figure out a way to make subscribe a promise to avoid nested callbacks.
      hz('nametags').upsert(nametag).subscribe(
        (id) => {
          dispatch(addNametag(nametag, id, nametag.roomId))
          resolve(id)
        }, reject)
    }).catch(errorLog('Error joining room'))
  }
}
