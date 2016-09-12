import React from 'react'
import getEmoji from 'get-emoji'

export default ({name}) =>
  <img style={{width: '16px', height: '16px'}} src={getEmoji(name)} />
