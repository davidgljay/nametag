import constants from '../constants'

const reactions = (state = {}, action) => {
  switch (action.type) {
    case constants.ADD_REACTION:
      return Object.assign({}, state, {[action.reaction.id]: action.reaction})
    default:
      return state
  }
}

export default reactions
