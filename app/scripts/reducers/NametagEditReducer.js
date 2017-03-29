import constants from '../constants'
import _ from 'lodash'

const updateNametagEdit = (state, action) => {
  let newNametag = {...state[action.room], [action.property]: action.value}
  return {...state, [action.room]: newNametag}
}

const addBadge = (state, action) => {
  const badges = state[action.room].badges
  ? _.uniqBy([action.badge].concat(state[action.room].badges), (b) => b.id)
    : [action.badge]
  const newEditNametag = {...state[action.room], badges: badges}
  return {...state, [action.room]: newEditNametag}
}

const removeBadge = (state, action) => {
  const editNametag = state[action.room]
  const newBadges = editNametag.badges.filter((b) => b !== action.badgeId)
  let newNametag = {...editNametag, badges: newBadges}
  return {...state, [action.room]: newNametag}
}

const nametagEdit = (state = {}, action) => {
  switch (action.type) {
    case constants.UPDATE_NAMETAG_EDIT:
      return updateNametagEdit(state, action)
    case constants.ADD_NT_EDIT_BADGE:
      return addBadge(state, action)
    case constants.REMOVE_NT_EDIT_BADGE:
      return removeBadge(state, action)
    default:
      return state
  }
}

export default nametagEdit
