import fbase from '../../api/firebase'
import errorLog from '../../utils/errorLog'
import constants from '../../constants'

export const addRoom = (room, key) => {
  return {
    type: constants.ADD_ROOM,
    room,
    key,
  }
}

/*
* Subscribe to a list of RoomCards
*
* @params
*    none
* TODO: add params for filtering and search
*
* @returns
*    Promise
*/
export function subscribe() {
  return function(dispatch) {
    return fbase.child('rooms').on('child_added', function onValue(value) {
      console.log(value.val())
      dispatch(addRoom(value.val(), value.key()))
    }, errorLog('Error subscribing to RoomCards'))
    // TODO:Add error handling
  }
}

/*
* Unsubscribe from a list of RoomCards
*
* @params
*    none
* TODO: add params for filtering and search
*
* @returns
*    Promise
*/
export function unsubscribe() {
  return function() {
    return fbase.child('rooms').off('child_added')
  }
}
