import constants from '../constants'

const messages = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_MESSAGE:
    return {...state, [action.id]: action.message}
  case constants.ADD_MESSAGE_ARRAY:
    return {...state, ...action.messages.reduce(
      (p, n) => {
        p[n.id] = n
        return p
      }, {}
    )}
  default:
    return state
  }
}

export default messages
