import { combineReducers } from 'redux'
import badges from './BadgeReducer'
import nametagEdits from './NametagEditReducer'
import {client} from '../graph/client'
import typingPrompts from './TypingPromptReducer'

const mainReducer = combineReducers({
  badges,
  nametagEdits,
  typingPrompts,
  apollo: client.reducer()
})

export default mainReducer
