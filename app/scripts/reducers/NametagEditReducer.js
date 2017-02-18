import constants from '../constants'
import _ from 'lodash'

const updateNametagEdit = (state, action) => {
  let newNametag = {...state[action.room], [action.property]: action.value}
  return {...state, [action.room]: newNametag}
}

const addBadge = (state, action) => {
  const certs = state[action.room].badges
  ? _.uniqBy([action.cert].concat(state[action.room].badges), (c) => c.id)
    : [action.cert]
  const newEditNametag = {...state[action.room], badges: certs}
  return {...state, [action.room]: newEditNametag}
}

const removeBadge = (state, action) => {
  const editNametag = state[action.room]
  const newCerts = _.remove(editNametag.badges, (c) => c === action.certId)
  let newNametag = {...editNametag, badges: newCerts}
  return {...state, [action.room]: newNametag}
}

const nametagEdit = (state = {}, action) => {
  switch (action.type) {
    case constants.UPDATE_NAMETAG_EDIT:
      return updateNametagEdit(state, action)
    case constants.ADD_NT_EDIT_CERT:
      return addBadge(state, action)
    case constants.REMOVE_NT_EDIT_CERT:
      return removeBadge(state, action)
    default:
      return state
  }
}

export default nametagEdit
