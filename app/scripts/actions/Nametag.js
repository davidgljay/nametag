import fbase from '../api/firebase'
import errorLog from '../utils/errorLog'
import constants from '../constants'

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
    return fbase.child('nametags').child(roomId).child(nametagId).on('value', function onValue(value) {
      dispatch(addNametag(value.val(), value.key(), roomId))
    }, errorLog('Error subscribing to Nametag ' + nametagId))
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
export function unsubscribe(nametagId, roomId) {
  return function() {
    fbase.child('nametag').child(roomId).child(nametagId).off('value')
  }
}
