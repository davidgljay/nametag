import constants from '../constants'

export function updateNametagEdit (about, property, value) {
  return {
    type: constants.UPDATE_NAMETAG_EDIT,
    about,
    property,
    value
  }
}

export function addNametagEditBadge (badge, about) {
  return {
    type: constants.ADD_NT_EDIT_BADGE,
    badge,
    about
  }
}

export function removeNametagEditBadge (badgeId, about) {
  return {
    type: constants.REMOVE_NT_EDIT_BADGE,
    badgeId,
    about
  }
}
