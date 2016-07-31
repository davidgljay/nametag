import constants from '../constants'

const rooms = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_ROOM:
    return Object.assign({}, state, {[action.key]: action.room})
  case constants.INCREMENT_ROOM_NT_COUNT:
    let nametagCount = state[action.roomId].nametagCount ? state[action.roomId].nametagCount + 1 : 1
    let newRoom = Object.assign({}, state[action.roomId], {nametagCount: nametagCount})
    return Object.assign({}, state, {[action.roomId]: newRoom})

  default:
    return state
  }
}

export default rooms
