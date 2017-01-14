import constants from '../constants'

const updateUserNametag = (state, action) => {
  let newNametag = Object.assign({}, state[action.room], {[action.property]: action.value})
  return Object.assign({}, state, {[action.room]: newNametag})
}

const userNametag = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_USER_NAMETAG:
    return Object.assign({}, state, {[action.room]: action.nametag})
  case constants.UPDATE_USER_NAMETAG:
    return updateUserNametag(state, action)
  default:
    return state
  }
}

export default userNametag
