import constants from '../constants'

const addCertificate = (state, action) => {
  let certs = [action.cert]
  let room = state[action.roomId]
  if (room.userNametag && room.userNametag.certificates) {
    let unique = true
    let currentCerts = room.userNametag.certificates
    for (let i = currentCerts.length - 1; i >= 0; i--) {
      if (currentCerts[i].id === action.cert.id) {
        unique = false
      }
    }
    if (unique) {
      certs = room.userNametag.certificates.concat(certs)
    }
  }
  let newNametag = Object.assign({}, room.userNametag, {certificates: certs})
  let newRoom = Object.assign({}, room, {userNametag: newNametag})
  return Object.assign({}, state, {[action.roomId]: newRoom})
}

const removeCertificate = (state, action) => {
  let certs = []
  let room = state[action.roomId]

  if (room.userNametag && room.userNametag.certificates) {
    certs = room.userNametag.certificates
  }
  let newCerts = certs.slice()
  for (let i = certs.length - 1; i >= 0; i--) {
    if (certs[i].id === action.certId) {
      newCerts = certs.slice(0, i).concat(certs.slice(i + 1, certs.length))
    }
  }
  let newNametag = Object.assign({}, room.userNametag, {certificates: newCerts})
  let newRoom = Object.assign({}, room, {userNametag: newNametag})
  return Object.assign({}, state, {[action.roomId]: newRoom})
}

const rooms = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_ROOM:
    return Object.assign({}, state, {[action.key]: action.room})
  case constants.SET_ROOM_NT_COUNT:
    let newRoom = Object.assign({}, state[action.roomId], {nametagCount: action.nametagCount})
    return Object.assign({}, state, {[action.roomId]: newRoom})
  case constants.ADD_USER_NT_CERT:
    return addCertificate(state, action)
  case constants.REMOVE_USER_NT_CERT:
    return removeCertificate(state, action)

  default:
    return state
  }
}

export default rooms
