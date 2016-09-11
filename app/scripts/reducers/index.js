import { combineReducers } from 'redux'
import rooms from './RoomReducer'
import nametags from './NametagReducer'
import user from './UserReducer'
import certificates from './CertificateReducer'
import messages from './MessageReducer'
import reactions from './RecationReducer'

const mainReducer = combineReducers({
  rooms,
  nametags,
  user,
  certificates,
  messages,
  reactions,
})

export default mainReducer
