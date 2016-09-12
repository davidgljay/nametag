import constants from '../constants'

const messages = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_MESSAGE:
    return Object.assign({}, state, {[action.id]: action.message})
  default:
    return state
  }
}

export default messages
