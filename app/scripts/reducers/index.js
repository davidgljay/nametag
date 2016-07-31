import { combineReducers } from 'redux'
import rooms from './Room'
import nametags from './Nametag'

const mainReducer = combineReducers({
  rooms,
  nametags,
})

export default mainReducer
