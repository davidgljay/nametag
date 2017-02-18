import { combineReducers } from 'redux'
import rooms from './RoomReducer'
import nametags from './NametagReducer'
import user from './UserReducer'
import badges from './BadgeReducer'
import messages from './MessageReducer'
import reactions from './ReactionReducer'
import userNametags from './UserNametagReducer'
import nametagEdits from './NametagEditReducer'

const mainReducer = combineReducers({
  rooms,
  nametags,
  user,
  badges,
  messages,
  reactions,
  userNametags,
  nametagEdits
})

export default mainReducer
