import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

let nametagSubscriptions = {}

export const addNametag = (nametag, id) => {
  return {
    type: constants.ADD_NAMETAG,
    nametag,
    id,
  }
}

/*
* Watch a Nametags
*
* @params
*    none
*
* @returns
*    Promise
*/
export function watchNametag(nametagId) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      nametagSubscriptions[nametagId] = hz('nametags').find(nametagId).watch().subscribe(
        (nametag) => {
          if (nametag) {
            resolve(dispatch(addNametag(nametag, nametag.id)))
          } else {
            reject('Nametag not found')
          }
        },
        (err) => {
          reject(err)
        })
    })
    .catch(errorLog('Error subscribing to Nametag ' + nametagId + ': '))
  }
}

/*
* Unsubscribe from a Nametag
*
* @params
*    none
*
* @returns
*    none
*/
export function unWatchNametag(nametagId) {
  return function() {
    nametagSubscriptions[nametagId].unsubscribe()
  }
}

/*
* Watch all nametags for a room
*
* @params
*    roomId
*
* @returns
*    promise
*/
export function watchRoomNametags(room) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      nametagSubscriptions[room] = hz('nametags').findAll({room: room}).watch().subscribe(
        (nametags) => {
          for (let i = 0; i < nametags.length; i++) {
            dispatch(addNametag(nametags[i], nametags[i].id))
          }
          resolve(nametags)
        }, reject)
    })
    .catch(errorLog('Error subscribing to Nametags for room ' + room + ': '))
  }
}

/*
* Unwatched all nametags for a room
*
* @params
*    roomId
*
* @returns
*    promise
*/
export function unWatchRoomNametags(room) {
  return function() {
    nametagSubscriptions[room].unsubscribe()
  }
}

/*
* Adds a nametag to the database
*
*@params
*   nametag - The content of the nametag
*
* @returns
*   none
*/

export function putNametag(nametag) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('nametags').upsert(nametag).subscribe((id) => {
        resolve(id.id)
      }, reject)
    }).catch(errorLog('Adding user nametag'))
  }
}

