import React, {PropTypes, Component} from 'react'
import {Emoji} from 'emoji-mart'
import {grey, white} from '../../../styles/colors'

class EmojiReactions extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showName: null,
      timer: null
    }

    this.onReactionClick = emoji => e => {
      e.preventDefault()
      const {myNametag, messageId, addReaction} = this.props
      addReaction(messageId, emoji, myNametag.id, myNametag.name)
    }

    this.setShowName = showName => () => {
      if (showName !== null) {
        this.setState({timer: setTimeout(() => this.setState({showName}), 750)})
      } else {
        clearTimeout(this.state.timer)
        this.setState({showName})
      }
    }
  }

  render () {
    const {reactions, myNametag} = this.props
    const {showName} = this.state

    const reactionsHash = reactions.reduce(
      (compressed, react) => {
        if (compressed[react.emoji]) {
          compressed[react.emoji].push({name: react.name, nametagId: react.nametagId})
        } else {
          compressed[react.emoji] = [{name: react.name, nametagId: react.nametagId}]
        }
        return compressed
      }, {})

    const reactionsArray = Object.keys(reactionsHash).map(key => ({
      emoji: key,
      names: reactionsHash[key].map(react => react.name),
      alreadyClicked: reactionsHash[key].find(react => react.nametagId === myNametag.id) !== undefined
    }))

    return <div style={styles.container}> {
          reactionsArray.map((reaction, i) =>
            <div
              key={reaction.emoji}
              style={reaction.alreadyClicked ? styles.reaction : {...styles.reaction, ...styles.clickable}}
              onMouseEnter={this.setShowName(i)}
              onMouseLeave={this.setShowName(null)}
              onClick={reaction.alreadyClicked ? () => {} : this.onReactionClick(reaction.emoji)}>
              <Emoji emoji={reaction.emoji} set='emojione' size={14} />
              {reaction.names.length}
              {
                showName === i &&
                <div style={styles.names}>
                  {reaction.names.join(', ')}
                </div>
              }
            </div>
          )
    }
    </div>
  }
}

const {string, arrayOf, shape, func} = PropTypes
EmojiReactions.propTypes = {
  reactions: arrayOf(shape({
    emoji: string.isRequired,
    nametagId: string.isRequired
  })),
  addReaction: func.isRequired,
  messageId: string.isRequired,
  myNametag: shape({
    id: string.isRequired,
    name: string.isRequired
  }).isRequired
}
export default EmojiReactions

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 3
  },
  reaction: {
    border: `1px solid ${grey}`,
    borderRadius: 3,
    color: grey,
    padding: 3,
    display: 'flex',
    height: 17,
    marginRight: 4,
    fontSize: 10,
    cursor: 'default'
  },
  clickable: {
    cursor: 'pointer'
  },
  names: {
    position: 'absolute',
    border: `1px solid ${grey}`,
    borderRadius: 2,
    padding: 2,
    background: white,
    zIndex: 50,
    maxWidth: 300
  }
}
