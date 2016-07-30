import { combineReducers } from 'redux'
import rooms from './Room/Room'

const mainReducer = combineReducers({
  rooms,
})

export default mainReducer
