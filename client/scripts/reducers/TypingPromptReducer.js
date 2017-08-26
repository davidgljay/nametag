import constants from '../constants'

const addTypingPrompt = (state, action) => {
  clearTimeout(state[action.nametagId])
  return {...state, [action.nametagId]: action.timer}
}

const removeTypingPrompt = (state, action) => {
  clearTimeout(state[action.nametagId])
  return Object.keys(state).reduce((newState, key) => key === action.nametagId
    ? newState
    : {...newState, [key]: state[key]}, {})
}

const typingPromptReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.ADD_TYPING_PROMPT:
      return addTypingPrompt(state, action)
    case constants.REMOVE_TYPING_PROMPT:
      return removeTypingPrompt(state, action)
    default:
      return state
  }
}

export default typingPromptReducer
