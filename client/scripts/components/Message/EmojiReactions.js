import React, {PropTypes} from 'react'
import {Emoji} from 'emoji-mart'
import {grey} from '../../../styles/colors'

const EmojiReactions = ({reactions, addReaction, myNametagId, messageId}) => {
  const reactionsHash = reactions.reduce(
    (compressed, react) => {
      if (compressed[react.emoji]) {
        compressed[react.emoji].push(react.nametagId)
      } else {
        compressed[react.emoji] = [react.nametagId]
      }
      return compressed
    }, {})
  const reactionsArray = Object.keys(reactionsHash).map(key => ({
    emoji: key,
    count: reactionsHash[key].length,
    alreadyClicked: reactionsHash[key].indexOf(myNametagId) > -1
  }))

  const onReactionClick = emoji => e => addReaction(messageId, emoji, myNametagId)

  return <div style={styles.container}> {
        reactionsArray.map(reaction =>
          <div
            key={reaction.emoji}
            style={reaction.alreadyClicked ? styles.reaction : {...styles.reaction, ...styles.clickable}}
            onClick={reaction.alreadyClicked ? () => {} : onReactionClick(reaction.emoji)}>
            <Emoji emoji={reaction.emoji} set='emojione' size={14} />
            {reaction.count}
          </div>
        )
  }
  </div>
}

const {string, arrayOf, shape, func} = PropTypes
EmojiReactions.propTypes = {
  reactions: arrayOf(shape({
    emoji: string.isRequired,
    nametagId: string.isRequired
  })),
  addReaction: func.isRequired,
  messageId: func.isRequired,
  myNametagId: string.isRequired
}
export default EmojiReactions

const styles = {
  container: {
    display: 'flex'
  },
  reaction: {
    border: `1px solid ${grey}`,
    borderRadius: 3,
    color: grey,
    padding: 3,
    height: 17,
    marginRight: 4,
    fontSize: 10,
    cursor: 'default'
  },
  clickable: {
    cursor: 'pointer'
  }
}
