import constants from '../constants'
import _ from 'lodash'

const updateNametagEdit = (state, action) => {
  let newNametag = {...state[action.about], [action.property]: action.value}
  return {...state, [action.about]: newNametag}
}

const addBadge = (state, action) => {
  const badges = state[action.about].badges
  ? _.uniqBy([action.badge].concat(state[action.about].badges), b => b.id)
    : [action.badge]
  const newEditNametag = {...state[action.about], badges: badges}
  return {...state, [action.about]: newEditNametag}
}

const removeBadge = (state, action) => {
  const editNametag = state[action.about]
  const newBadges = editNametag.badges.filter(b => b.id !== action.badgeId)
  let newNametag = {...editNametag, badges: newBadges}
  return {...state, [action.about]: newNametag}
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
