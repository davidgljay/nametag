import constants from '../constants'

function addUserNametag(state, action) {
  let newNametags = Object.assign({}, state.nametags, {[action.room]:action.nametag})
  return Object.assign({}, state, {nametags: newNametags})
}

const user = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_USER:
    return Object.assign({}, {id: action.id, data: action.data})
  case constants.LOGOUT_USER:
    return false
  case constants.ADD_USER_NAMETAG:
    return addUserNametag(state, action)
  default:
    return state
  }
}

export default user
