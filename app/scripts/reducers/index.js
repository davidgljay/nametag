import { combineReducers } from 'redux'
import rooms from './RoomReducer'
import nametags from './NametagReducer'
import user from './UserReducer'
import certificates from './CertificateReducer'
import messages from './MessageReducer'

const mainReducer = combineReducers({
  rooms,
  nametags,
  user,
  certificates,
  messages,
})

export default mainReducer
