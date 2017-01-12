import constants from '../constants'


export function updateNametagEdit(room, property, value) {
  return {
    type: constants.UPDATE_NAMETAG_EDIT,
    room,
    property,
    value,
  }
}
