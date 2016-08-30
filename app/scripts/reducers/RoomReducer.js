import constants from '../constants'

const addRoom = (state, action) => {
  let newRoom = Object.assign({}, state[action.id], action.room)
  return Object.assign({}, state, {[action.id]: newRoom})
}

const addCertificate = (state, action) => {
  let certs = [action.cert]
  let room = state[action.room]
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
  return Object.assign({}, state, {[action.room]: newRoom})
}

const removeCertificate = (state, action) => {
  let certs = []
  let room = state[action.room]

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
  return Object.assign({}, state, {[action.room]: newRoom})
}

const updateNametag = (state, action) => {
  let room = state[action.room]
  let newNametag = Object.assign({}, room.userNametag, {[action.property]: action.value})
  let newRoom = Object.assign({}, room, {userNametag: newNametag})
  return Object.assign({}, state, {[action.room]: newRoom})
}

const setRoomProp = (state, action) => {
  let room = state[action.room]
  let newRoom = Object.assign({}, room, {[action.property]: action.value})
  return Object.assign({}, state, {[action.room]: newRoom})
}

const rooms = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_ROOM:
    return addRoom(state, action)
  case constants.SET_ROOM_NT_COUNT:
    let newRoom = Object.assign({}, state[action.room], {nametagCount: action.nametagCount})
    return Object.assign({}, state, {[action.room]: newRoom})
  case constants.ADD_USER_NT_CERT:
    return addCertificate(state, action)
  case constants.REMOVE_USER_NT_CERT:
    return removeCertificate(state, action)
  case constants.UPDATE_USER_NAMETAG:
    return updateNametag(state, action)
  case constants.SET_ROOM_PROP:
    return setRoomProp(state, action)
  default:
    return state
  }
}

export default rooms
