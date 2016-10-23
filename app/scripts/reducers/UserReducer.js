import constants from '../constants'

const user = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_USER:
    return Object.assign({}, {id: action.id, data: action.data})
  case constants.LOGOUT_USER:
    return {loggedIn: false}
  case constants.USER_SETTING:
    return Object.assign({}, state, {[action.option]: action.value})
  default:
    return state
  }
}

export default user
