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
* Subscribe to a Nametags
*
* @params
*    none
*
* @returns
*    Promise
*/
export function subscribe(nametagId) {
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
export function unsubscribe(nametagId) {
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
export function getRoomNametags(room) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      nametagSubscriptions[room] = hz('nametags').findAll({room: room}).watch().subscribe(
        (nametags) => {
          for (let i = 0; i < nametags.length; i++) {
            dispatch(addNametag(nametags[i], nametags[i].id))
          }
          resolve()
        }, reject)
    })
    .catch(errorLog('Error subscribing to Nametags for room ' + room + ': '))
  }
}
