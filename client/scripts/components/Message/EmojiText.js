import React, {PropTypes} from 'react'
import {Emoji} from 'emoji-mart'

const EmojiText = ({text}) => {
  if (!text) {
    return null
  }
  const emojiMatches = text.match(/:[^: ]+:/g)
  let textArray = text.split(/:[^: ]+:/g)
  if (emojiMatches) {
    for (var i = 0; i < emojiMatches.length; i++) {
      if (emojiMatches[i].match('skin-tone')) {
        textArray.splice(i * 2 + 1, 0, '')
        const prev = (i - 1) * 2 + 1
        textArray[prev].emoji = textArray[prev].emoji + emojiMatches[i]
      } else {
        textArray.splice(i * 2 + 1, 0, {emoji: emojiMatches[i]})
      }
    }
  }
  const result = textArray.map((t, i) => typeof t === 'object'
    ? <Emoji emoji={t.emoji} set='emojione' size={20} key={i} />
    : t)
  return <span>{result}</span>
}

const {string} = PropTypes
EmojiText.propTypes = {
  text: string
}

export default EmojiText
