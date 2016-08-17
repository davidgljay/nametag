import { combineReducers } from 'redux'
import rooms from './RoomReducer'
import nametags from './NametagReducer'
import user from './UserReducer'
import certificates from './CertificateReducer'

const mainReducer = combineReducers({
  rooms,
  nametags,
  user,
  certificates,
})

export default mainReducer
