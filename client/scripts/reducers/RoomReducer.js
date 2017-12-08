import constants from '../constants'

const room = (state = {visibleReplies: '', badgeGrantee: '', badgeToGrant: null}, action) => {
  switch (action.type) {
    case constants.SET_VISIBLE_REPLIES:
      return {...state, visibleReplies: action.messageId}
    case constants.SET_BADGE_GRANTEE:
      return {...state, badgeGrantee: action.nametagId}
    case constants.SET_BADGE_TO_GRANT:
      return {...state, badgeToGrant: action.badge}
    default:
      return state
  }
}

export default room
