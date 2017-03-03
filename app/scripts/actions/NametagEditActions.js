import constants from '../constants'

export function updateNametagEdit (room, property, value) {
  return {
    type: constants.UPDATE_NAMETAG_EDIT,
    room,
    property,
    value
  }
}

export function addNametagEditBadge (badge, room) {
  return {
    type: constants.ADD_NT_EDIT_BADGE,
    badge,
    room
  }
}

export function removeNametagEditBadge (badgeId, room) {
  return {
    type: constants.REMOVE_NT_EDIT_BADGE,
    badgeId,
    room
  }
}
