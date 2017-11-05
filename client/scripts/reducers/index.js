import { combineReducers } from 'redux'
import badges from './BadgeReducer'
import nametagEdits from './NametagEditReducer'
import room from './RoomReducer'
import {client} from '../graph/client'
import typingPrompts from './TypingPromptReducer'

const mainReducer = combineReducers({
  badges,
  nametagEdits,
  typingPrompts,
  room,
  apollo: client.reducer()
})

export default mainReducer
