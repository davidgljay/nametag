import { combineReducers } from 'redux'
import rooms from './RoomReducer'
import nametags from './NametagReducer'
import user from './UserReducer'
import certificates from './CertificateReducer'
import messages from './MessageReducer'
import reactions from './ReactionReducer'
import userNametags from './UserNametagReducer'
import nametagEdits from './NametagEditReducer'

const mainReducer = combineReducers({
  rooms,
  nametags,
  user,
  certificates,
  messages,
  reactions,
  userNametags,
  nametagEdits,
})

export default mainReducer
