import { combineReducers } from 'redux'
import rooms from './RoomReducer'
import nametags from './NametagReducer'

const mainReducer = combineReducers({
  rooms,
  nametags,
})

export default mainReducer
