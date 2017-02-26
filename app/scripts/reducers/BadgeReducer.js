import constants from '../constants'

const badges = (state = {}, action) => {
  switch (action.type) {
    case constants.ADD_BADGE_ARRAY:
      return {
        ...state,
        ...action.badges.reduce(
      (p, n) => {
        p[n.id] = n
        return p
      }, {}
    )}
    case constants.UPDATE_BADGE:
      const newCert = Object.assign({}, state[action.id], {[action.property]: action.value})
      return Object.assign({}, state, {[action.id]: newCert})
    default:
      return state
  }
}

export default badges
