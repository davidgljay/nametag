import React, {Component, PropTypes} from 'react'
import EmojiReactions from './EmojiReactions'

class Reactions extends Component {

  constructor(props) {
    super(props)
    this.addReaction = this.addReaction.bind(this)
    this.reactionsToArray = this.reactionsToArray.bind(this)
  }

  componentDidMount() {
    this.props.watchMessageReactions(this.props.message)
  }

  componentWillUnmount() {
    this.props.unWatchMessageReactions(this.props.message)
  }

  addReaction(emoji) {
    let reaction = {
      emoji,
      message: this.props.message,
      nametag: this.context.userNametag,
    }
    this.props.addReaction(reaction)
  }

  reactionsToArray(reactions) {
    return Object.keys(reactions)
      .reduce((array, id) => {
        let newEmoji = true
        const reaction = reactions[id]
        for (let i = 0; i < array.length; i++) {
          if (array[i].name === reaction.emoji) {
            newEmoji = false
            array[i].count++
          }
        }
        if (newEmoji) {
          array.push({
            name: reaction.emoji,
            count: 1,
          })
        }
        return array
      }, [])
  }

  render() {
    const wrapperStyle = {
      height: '2em',
    }
    const selectorStyle = {
      position: 'absolute',
      left: 'unset',
      top: 'unset',
    }
    const xStyle = {
      color: 'black',
      marginTop: -45,
      marginRight: 7,
    }

    const reactionsArray = this.reactionsToArray(this.props.reactions)
    return <EmojiReactions
      reactions={reactionsArray}
      onReaction={this.addReaction}
      onEmojiClick={this.addReaction}
      wrapperStyle={wrapperStyle}
      selectorStyle={selectorStyle}
      xStyle={xStyle}/>
  }
}


Reactions.propTypes = {
  message: PropTypes.string.isRequired,
  reactions: PropTypes.object.isRequired,
}

Reactions.contextTypes = {
  userNametag: PropTypes.string,
}

export default Reactions
