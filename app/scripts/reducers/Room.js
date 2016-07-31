import constants from '../constants'

const rooms = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_ROOM:
    return Object.assign({}, state, {[action.key]: action.room})

  default:
    return state
  }
}

export default rooms
