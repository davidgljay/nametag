import constants from '../constants'

const room = (state = {visibleReplies: ''}, action) => {
  switch (action.type) {
    case constants.SET_VISIBLE_REPLIES:
      return {...state, visibleReplies: action.messageId}
    default:
      return state
  }
}

export default room
