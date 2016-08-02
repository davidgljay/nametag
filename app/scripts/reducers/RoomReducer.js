import constants from '../constants'

const rooms = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_ROOM:
    return Object.assign({}, state, {[action.key]: action.room})
  case constants.SET_ROOM_NT_COUNT:
    let newRoom = Object.assign({}, state[action.roomId], {nametagCount: action.nametagCount})
    return Object.assign({}, state, {[action.roomId]: newRoom})

  default:
    return state
  }
}

export default rooms
