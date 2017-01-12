import {hz} from '../api/horizon'
import errorLog from '../utils/errorLog'
import constants from '../constants'
import {addNametag, putNametag} from './NametagActions'
import {putUserNametag} from './UserNametagActions'
import _ from 'lodash'

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
      nametagSubscriptions.push(hz('nametags').findAll({room}).watch().subscribe(
          (nametags) => {
            const present = nametags.filter(
              ({lastPresent}) => {
                return lastPresent > Date.now() - 30000
              }
            )
            resolve(dispatch(setRoomNametagCount(room, present.length)))
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
* Fetch rooms
* @params
*   ids - An array of room Ids to be fetched
*
* @returns
*   Promise
*/
export function fetchRooms(ids) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('rooms').findAll(..._.uniq(ids).map((id) => {return {id}})).fetch()
      .subscribe((rooms) => {
        for (let i = 0; i < rooms.length; i++ ) {
          dispatch(addRoom(rooms[i], rooms[i].id))
        }
        resolve(rooms)
      }, reject)
    }).catch(errorLog('Error fetching rooms'))
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
      roomWatches[id] = hz('rooms').find(id).watch().subscribe((room) => {
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
    const start = startAt ? '&start=' + startAt : ''
    const url = 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_search?query=' + query + start
    return fetch(url)
      .then(res => {
        return res.ok ? res.json() :
          Promise.reject(`Error searching images for ${query}`)
      }).catch(errorLog('Searching for image'))
  }
}

/*
* Upload an image
* @params
*   url - The url of the image to be loaded
*
* @returns
*   Promise resolving to uploaded image
*/
export function setImageFromUrl(width, height, url) {
  return () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({width, height, url}),
    }
    return fetch('/api/image_url', options)
      .then(res => {
        return res.ok ? res.json() :
          Promise.reject(`Error searching images for ${query}`)
      }).catch(errorLog('Searching for image'))
  }
}

/*
* Posts a room to the server
*
* @params
*   room -The complete room object to be posted
*
* @returns
*   Promise resolving to room id
*/
export function postRoom(room) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('rooms').insert(room).subscribe((res) => {
        dispatch(addRoom({ ...room, id: res.id }, res.id))
        resolve(res.id)
      }, reject)
    }).catch(errorLog('Posting room'))
  }
}

/*
* Updates a room on the server
*
* @params
*   room -The id of the room to be updated
*   property - The property to be updated
*   value -The new value to be set
*
* @returns
*   Promise resolving to a response from horizon
*/
export function updateRoom(room, property, value) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('rooms').update({id: room, [property]: value}).subscribe((res) => {
        dispatch(setRoomProp(room, property, value))
        resolve(res)
      }, reject)
    }).catch(errorLog('Updating room'))
  }
}
