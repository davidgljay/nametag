import { combineReducers } from 'redux'
import badges from './BadgeReducer'
import nametagEdits from './NametagEditReducer'
import {client} from '../graph/client'

const mainReducer = combineReducers({
  badges,
  nametagEdits,
  apollo: client.reducer()
})

export default mainReducer
