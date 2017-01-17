import errorLog from '../utils/errorLog'
import constants from '../constants'
import {hz} from '../api/horizon'
import {addMessage} from './MessageActions'

export const postDirectMessage = (message) => {
  return () =>
    new Promise((resolve, reject) => {
      hz('direct_messages').upsert(message).subscribe(resolve, reject)
      .catch(errorLog('Error posting a direct message ' + JSON.stringify(message) + ': '))
    })
}
