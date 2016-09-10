import constants from '../constants'

const certificates = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_CERTIFICATE:
    return Object.assign({}, state, {[action.id]: action.certificate})
  default:
    return state
  }
}

export default certificates
