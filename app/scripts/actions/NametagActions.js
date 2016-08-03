import fbase from '../api/firebase'
import errorLog from '../utils/errorLog'
import constants from '../constants'
import hz from '../api/horizon'

let nametagSubscriptions = {}

export const addNametag = (nametag, id, roomId) => {
  return {
    type: constants.ADD_NAMETAG,
    nametag,
    id,
    roomId,
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
export function subscribe(nametagId, roomId) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      nametagSubscriptions[nametagId] = hz('nametags').find({id:nametagId}).watch().subscribe(
        (nametag) => {
          resolve(dispatch(addNametag(nametag, nametag.id, roomId)))
        },
        (err) => {
          errorLog('Error subscribing to Nametag ' + nametagId)(err)
          reject(err)
        })
    })
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
