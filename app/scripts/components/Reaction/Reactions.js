import React, {Component, PropTypes} from 'react'
import EmojiReactions from './EmojiReactions'
import EmojiSelector from './EmojiSelector'
import { Icon } from 'react-mdl'
import style from '../../../styles/Reaction/Reactions.css'

class Reactions extends Component {

  constructor(props) {
    super(props)
    this.addReaction = this.addReaction.bind(this)
    this.reactionsToArray = this.reactionsToArray.bind(this)
    this.toggleSelector = this.toggleSelector.bind(this)
    this.state = {
      showSelector:false,
    }
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

    //Do not add if the user had already indicated this reaction
    let unique = true
    Object.keys(this.props.reactions)
      .reduce((prev, id) => {
        if (this.props.reactions[id].emoji === reaction.emoji
          && this.props.reactions[id].nametag === reaction.nametag) {
          unique = false
        }
      }, [])
    if (unique) {
      this.props.addReaction(reaction)
    }
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

  toggleSelector() {
    this.setState({showSelector: !this.state.showSelector})
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
    return <span>
        {
         reactionsArray.length > 0 &&
          <EmojiReactions
            reactions={reactionsArray}
            toggleSelector={this.toggleSelector}
            onReaction={this.addReaction}
            wrapperStyle={wrapperStyle}/>
        }
        <Icon className={style.reactionIcon}
          name='insert_emoticon'
          onClick={this.toggleSelector} />
        <EmojiSelector
          showing={this.state.showSelector}
          onEmojiClick={this.addReaction}
          close={this.toggleSelector}
          customStyles={{selectorStyle, xStyle}}/>
      </span>
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
