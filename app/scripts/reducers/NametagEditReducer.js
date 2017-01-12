import constants from '../constants'

const updateNametagEdit = (state, action) => {
  let newNametag = {...state[action.room], [action.property]: action.value}
  return {...state, [action.room]: newNametag}
}

const nametagEdit = (state = {}, action) => {
  switch (action.type) {
  case constants.UPDATE_NAMETAG_EDIT:
    return updateNametagEdit(state, action)
  default:
    return state
  }
}

export default nametagEdit
