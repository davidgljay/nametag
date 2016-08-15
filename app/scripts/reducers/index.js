import { combineReducers } from 'redux'
import rooms from './RoomReducer'
import nametags from './NametagReducer'
import user from './UserReducer'

const mainReducer = combineReducers({
  rooms,
  nametags,
  user,
})

export default mainReducer
