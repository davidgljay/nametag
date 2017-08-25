import constants from '../constants'

const addTypingPrompt = (state, action) =>
  ({...state, [action.nametagId]: action.timer})

const removeTypingPrompt = (state, action) => {
  delete state[action.nametagId]
  return state
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
