import {hz} from '../api/horizon'
import constants from '../constants'
import errorLog from '../utils/errorLog'

/*
* Adds a user nametag to the redux store
*
*@params
*   room -The id of the room that the nametag appears in
*   nametag - The complete nametag object to be stored
*
* @returns
*   Action object
*/
export function addUserNametag(room, nametag) {
  return {
    type: constants.ADD_USER_NAMETAG,
    room,
    nametag,
  }
}

/*
* Puts a record linking a nametag to the user's account
*
*@params
*   room -The id of the room that the nametag appears in
*   user - The id of the user
*   nametag - The id of the nametag
*
* @returns
*   Promise resolving to nametag id
*/
export function putUserNametag(room, user, nametag) {
  return () => {
    return new Promise((resolve, reject) => {
      hz('user_nametags').upsert({room, user, nametag, mentions: []}).subscribe((id) => {
        resolve(id)
      }, reject)
    }).catch(errorLog('Putting user nametag'))
  }
}

/*
* Gets the user's nametag for a particular room
*
*@params
*   room - The id of the room
*   user - the id of the current user
*
* @returns
*   none
*/
let userNametagsSubscr
export function watchUserNametags(user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      userNametagsSubscr = hz('user_nametags').findAll({user}).watch()
      .subscribe((userNametags) => {
        for (let i = 0; i < userNametags.length; i++) {
          dispatch(addUserNametag(userNametags[i].room, userNametags[i]))
        }
        resolve(userNametags)
      }, reject)
    }).catch(errorLog('Watching user nametags'))
  }
}

export function unWatchUserNametags() {
  return () => {
    userNametagsSubscr.unsubscribe()
  }
}

export function updateUserNametag(room, property, value) {
  return {
    type: constants.UPDATE_USER_NAMETAG,
    room,
    property,
    value,
  }
}

export function postUpdateUserNametag(id, property, value) {
  return () => new Promise((resolve, reject) => {
    hz('user_nametags').update({id, [property]: value}).subscribe(() => {
      resolve()
    }, reject)
  }).catch(errorLog('Updating user_nametag'))
}
