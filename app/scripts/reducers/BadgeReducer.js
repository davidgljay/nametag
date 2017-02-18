import constants from '../constants'

const badges = (state = {}, action) => {
  switch (action.type) {
    case constants.ADD_CERTIFICATE:
      return Object.assign({}, state, {[action.id]: action.certificate})
    case constants.UPDATE_CERTIFICATE:
      const newCert = Object.assign({}, state[action.id], {[action.property]: action.value})
      return Object.assign({}, state, {[action.id]: newCert})
    default:
      return state
  }
}

export default badges
