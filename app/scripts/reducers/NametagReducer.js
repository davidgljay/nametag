import constants from '../constants'

const nametags = (state = {}, action) => {
  switch (action.type) {
    case constants.ADD_NAMETAG:
      return {...state, [action.id]: action.nametag}
    case constants.ADD_NAMETAG_ARRAY:
      return {
        ...state,
        ...action.nametags.reduce(
      (p, n) => {
        p[n.id] = n
        return p
      }, {}
    )}
    default:
      return state
  }
}

export default nametags
