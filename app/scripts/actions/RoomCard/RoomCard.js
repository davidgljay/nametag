import fbase from '../../api/firebase'

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
    return fbase.on('value', function onValue(value) {
      console.log('Got value')
      console.log(value.val())
    })
    // TODO:Add error handling
  }
}

export function unsubscribe() {
  return function(dispatch) {
    return fbase.off('value')
  }
}
