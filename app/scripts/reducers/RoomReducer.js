import constants from '../constants'

const addRoom = (state, action) => {
  let newRoom = Object.assign({}, state[action.id], action.room)
  return Object.assign({}, state, {[action.id]: newRoom})
}

const setRoomProp = (state, action) => {
  let room = state[action.room]
  let newRoom = Object.assign({}, room, {[action.property]: action.value})
  return Object.assign({}, state, {[action.room]: newRoom})
}

const addRoomMessage = (state, action) => {
  let room = state[action.room]
  let newMessages = room.messages.slice()
  newMessages.push(action.messageId)
  let newRoom = Object.assign({}, room, {messages: newMessages})
  return Object.assign({}, state, {[action.room]: newRoom})
}

const rooms = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_ROOM:
    return addRoom(state, action)
  case constants.SET_ROOM_NT_COUNT:
    let newRoom = Object.assign({}, state[action.room], {nametagCount: action.nametagCount})
    return Object.assign({}, state, {[action.room]: newRoom})
  case constants.SET_ROOM_PROP:
    return setRoomProp(state, action)
  case constants.ADD_ROOM_MESSAGE:
    return addRoomMessage(state, action)
  default:
    return state
  }
}

export default rooms
