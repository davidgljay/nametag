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
      hz('user_nametags').insert({room, user, nametag}).subscribe((id) => {
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
export function getUserNametag(room, user) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      hz('user_nametags').findAll({user}).fetch().subscribe((userNametags) => {
        let userNametag = null
        for (let i = 0; i < userNametags.length; i++) {
          if (userNametags[i].room === room) {
            userNametag = userNametags[i].nametag
          }
        }
        if (userNametag) {
          dispatch(updateUserNametag(room, 'id', userNametag))
        }
        dispatch(updateUserNametag(room, 'room', room))
        resolve(userNametag)
      }, reject)
    }).catch(errorLog('Getting user nametag'))
  }
}

export function addUserNametagCert(cert, room) {
  return {
    type: constants.ADD_USER_NT_CERT,
    cert,
    room,
  }
}

export function removeUserNametagCert(certId, room) {
  return {
    type: constants.REMOVE_USER_NT_CERT,
    certId,
    room,
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
