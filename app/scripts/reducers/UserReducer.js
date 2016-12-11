import constants from '../constants'

const user = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_USER:
    return Object.assign({}, {id: action.id, data: action.data})
  case constants.LOGOUT_USER:
    return {loggedIn: false}
  case constants.USER_SETTING:
    return Object.assign({}, state, {[action.option]: action.value})
  case constants.UPDATE_USER_ARRAY:
    const data = Object.assign({}, state.data,
      {[action.property]: state.data[action.property].concat(action.value)})
    return Object.assign({}, state, {data})
  default:
    return state
  }
}

export default user
