import {hz} from '../api/horizon'
import errorLog from '../utils/errorLog'
import constants from '../constants'
import {addNametag, putNametag} from './NametagActions'
import {putUserNametag} from './UserNametagActions'
import {fetchUrl} from 'fetch'

let roomWatches = {}
let roomSubscription
let nametagSubscriptions = []

export function addRoom(room, id) {
  return {
    type: constants.ADD_ROOM,
    room,
    id,
  }
}

export function setRoomNametagCount(room, nametagCount) {
  return {
    type: constants.SET_ROOM_NT_COUNT,
    room,
    nametagCount,
  }
}

export function setRoomProp(room, property, value) {
  return {
    type: constants.SET_ROOM_PROP,
    room,
    property,
    value,
  }
}


/*
* Optimistically add a messageId to a room.
* The action of this message will be overwritten once the message has been
* posted to the server
*/
export function addRoomMessage(room, messageId) {
  return {
    type: constants.ADD_ROOM_MESSAGE,
    room,
    messageId,
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
*    room- the id of the room to get the nametag count for
*
* @returns
*    Promise
*/
export function getNametagCount(room) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      nametagSubscriptions.push(hz('nametags').findAll({room: room}).watch().subscribe(
          (nametags) => {
            resolve(dispatch(setRoomNametagCount(room, nametags.length)))
          }, reject)
        )
    }).catch(errorLog('Error joining room'))
  }
}

/*
* Join a room
*
* @params
*   roomId -The id of the room being joined
*   nametag - The nametag with which to join the room
*   userId - The id of the currently logged in user
*
* @returns
*   Promise resolving to the ID of the newly created nametag
*/
export function joinRoom(roomId, nametag, userId) {
  let nametagId
  return (dispatch) => {
    return dispatch(putNametag(nametag))
      .then((id) => {
        nametagId = id
        dispatch(addNametag(nametag, id, nametag.room))
        return dispatch(putUserNametag(roomId, userId, id))
      })
      .then(() => {
        return nametagId
      }).catch(errorLog('Error joining room'))
  }
}

/*
* Watch room
* @params
*   roomId - The room to watch
*
* @returns
*   Promise
*/
export function watchRoom(id) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      console.log("Watching room")
      roomWatches[id] = hz('rooms').find(id).watch().subscribe((room) => {
        console.log("Got room response")
        dispatch(addRoom(room, room.id))
        resolve(room)
      }, reject)
    }).catch(errorLog('Error getting room'))
  }
}

/*
* Unwatch room
* @params
*   roomId - The room to watch
*
* @returns
*   Promise
*/
export function unWatchRoom(id) {
  return () => {
    roomWatches[id].unsubscribe()
  }
}

/*
* Search Images
* @params
*   searchString
*
* @returns
*   Promise resolving to search string queries
*/
export function searchImage(query, startAt) {
  return () => {
    return new Promise((resolve, reject) => {
      const start = startAt ? '&start=' + startAt : ''
      fetchUrl('https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_search?query=' + query + start
        , (err, meta, body) => {
          if (err) {
            reject(err)
            return
          }
          if (meta.status !== 200) {
            reject(meta.status)
          }
          try {
            resolve(JSON.parse(JSON.parse(body)))
          } catch (error) {
            console.log(JSON.parse(body))
            reject('Error parsing JSON for ' + query + ',' + startAt)
          }
        })
    }).catch(errorLog('Searching for image'))
  }
}

