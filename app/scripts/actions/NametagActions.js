import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'
import _ from 'lodash'

let nametagsSubscription

let nametagRoomSubscriptions = {}

export const addNametag = (nametag, id) => {
  return {
    type: constants.ADD_NAMETAG,
    nametag,
    id
  }
}

export const addNametagArray = (nametags) => {
  return {
    type: constants.ADD_NAMETAG_ARRAY,
    nametags
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
export function watchNametags (nametagIds) {
  return (dispatch) => new Promise((resolve, reject) => {
    const nametagSearch = nametagIds.map(id => ({id}))
    nametagsSubscription = hz('nametags').findAll(...nametagSearch).watch().subscribe(
        (nametags) => {
          if (!nametags) { reject('Not Found') }
          dispatch(addNametagArray(nametags))
          resolve(nametags)
        },
        reject)
  })
    .catch(errorLog('Error subscribing to Nametags:'))
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
export function unWatchNametags () {
  return function () {
    nametagsSubscription.unsubscribe()
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
export function watchRoomNametags (room) {
  return (dispatch) => new Promise((resolve, reject) => {
    nametagRoomSubscriptions[room] = hz('nametags').findAll({room}).watch().subscribe(
      (nametags) => {
        dispatch(addNametagArray(nametags))
        resolve(nametags)
      }, reject)
  })
  .catch(errorLog('Error subscribing to Nametags for room ' + room + ': '))
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
export function unWatchRoomNametags (room) {
  return function () {
    nametagRoomSubscriptions[room].unsubscribe()
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

export function putNametag (nametag) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('nametags').upsert(nametag).subscribe((res) => resolve(res.id), reject)
    }).catch(errorLog('Adding user nametag'))
  }
}

/*
* Updates a nametag in the database
*
*@params
*   nametagId - The id of the nametag
*   property - The property to update
*   value - The value to be updated
*
* @returns
*   none
*/

export function updateNametag (nametagId, property, value) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('nametags').update({id: nametagId, [property]: value}).subscribe(() => {
        resolve()
      }, reject)
    }).catch(errorLog('Updating nametag'))
  }
}

/*
* Demonstrates that a particular nametag is present in the its room.
*
*@params
*   nametagId - The id of the nametag
*   property - The property to update
*   value - The value to be updated
*
* @returns
*   none
*/

export function showPresence (nametagId) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('nametag_presence').upsert({id: nametagId, present: Date.now()})
      .subscribe(resolve, reject)
    }).catch(errorLog('Updating nametag presence'))
  }
}
