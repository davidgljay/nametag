import constants from '../constants'

const nametags = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_NAMETAG:
    return Object.assign({}, state, {[action.id]: action.nametag})
  default:
    return state
  }
}

export default nametags
