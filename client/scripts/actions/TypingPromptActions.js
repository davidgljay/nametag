import constants from '../constants'

/*
* Search Images
* @params
*   nametagId
*
* Adds a typing prompt and sets a timer to remove that typing prompt unless
* another one is received from the server.
*/
export const addTypingPrompt = (nametagId) => (dispatch) => {
  return {
    type: constants.ADD_TYPING_PROMPT,
    nametagId,
    timer: setTimeout(() => dispatch(removeTypingPrompt(nametagId)), constants.TYPING_PROMPT_DELAY)
  }
}

export function removeTypingPrompt (nametagId) {
  return {
    type: constants.REMOVE_TYPING_PROMPT,
    nametagId
  }
}
