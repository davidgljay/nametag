import constants from '../constants'

export function updateNametagEdit (room, property, value) {
  return {
    type: constants.UPDATE_NAMETAG_EDIT,
    room,
    property,
    value
  }
}

export function addNametagEditCert (cert, room) {
  return {
    type: constants.ADD_NT_EDIT_CERT,
    cert,
    room
  }
}

export function removeNametagEditCert (certId, room) {
  return {
    type: constants.REMOVE_NT_EDIT_CERT,
    certId,
    room
  }
}
