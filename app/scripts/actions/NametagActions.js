import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'

let nametagSubscriptions = {}

export const addNametag = (nametag, id, room) => {
  return {
    type: constants.ADD_NAMETAG,
    nametag,
    id,
    room,
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
export function subscribe(nametagId, room) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      nametagSubscriptions[nametagId] = hz('nametags').find(nametagId).watch().subscribe(
        (nametag) => {
          if (nametag) {
            resolve(dispatch(addNametag(nametag, nametag.id, room)))
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
