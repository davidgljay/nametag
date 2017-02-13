import constants from '../constants'
import update from 'react-addons-update'

const messages = (state = {}, action) => {
  switch (action.type) {
    case constants.ADD_MESSAGE:
      return {...state, [action.id]: action.message}
    case constants.ADD_MESSAGE_ARRAY:
      return {
        ...state,
        ...action.messages.reduce(
      (p, n) => {
        p[n.id] = n
        return p
      }, {}
    )}
    case constants.SAVE_MESSAGE:
      return update(state, {[action.id]: {saved: {$set: action.saved}}})
    default:
      return state
  }
}

export default messages
