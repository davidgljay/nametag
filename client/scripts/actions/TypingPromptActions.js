import constants from '../constants'

/*
* Search Images
* @params
*   nametagId
*
* Adds a typing prompt and sets a timer to remove that typing prompt unless
* another one is received from the server.
*/
export function addTypingPrompt (nametagId) {
  return (dispatch, getState) => {
    clearTimeout(getState().typingPrompts[nametagId])
    return {
      type: constants.ADD_TYPING_PROMPT,
      nametagId,
      timer: setTimeout(() => removeTypingPrompt(nametagId), 5000)
    }
  }
}

export function removeTypingPrompt (nametagId) {
  return () => ({
    type: constants.REMOVE_TYPING_PROMPT,
    nametagId
  })
}
