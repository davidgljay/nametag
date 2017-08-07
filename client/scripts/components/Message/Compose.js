import React, { Component, PropTypes } from 'react'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {grey} from '../../../styles/colors'
import FontIcon from 'material-ui/FontIcon'
import NametagIcon from '../Nametag/NametagIcon'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Popover from 'material-ui/Popover'
import {Picker} from 'emoji-mart'
import emojiText from 'emoji-text'
import key from 'keymaster'
import {track, increment} from '../../utils/analytics'

class Compose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false
    }

    this.onChange = (e) => {
      const text = e.target.value
      const {onUpdateText} = this.props
      if (onUpdateText) {
        onUpdateText(text)
      }

      if (text.slice(-1) === '\n') {
        this.post(e)
        return
      }
      this.setState({
        message: text
      })
    }

    this.post = (e) => {
      const {myNametag, roomId, createMessage, onPost} = this.props
      const {message} = this.state
      if (onPost) {
        onPost(message)
      }
      track('POST_MESSAGE', {room: roomId})
      increment('MESSAGES_POSTED')
      e.preventDefault()
      if (message.length > 0) {
        let msg = {
          text: emojiText.convert(message, {delimiter: ':'}),
          author: myNametag.id,
          room: roomId
        }
        this.setState({message: '', showEmoji: false, showMentionMenu: false})
        createMessage(msg, myNametag)
      }
    }

    this.toggleEmoji = (open) => () => {
      if (open) {
        track('EMOJI_MENU_OPEN')
      }
      // Make it so the back button closes emoji rather than leaving the room
      if (open) {
        window.location.hash = 'showEmoji'
      } else if (window.location.hash === '#showEmoji') {
        window.history.back()
      }
      this.setState({showEmoji: open})
    }
  }

  componentWillMount () {
    key('enter', 'compose', this.post)
    window.onhashchange = () => {
      this.setState({showEmoji: window.location.hash === '#showEmoji'})
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.defaultMessage !== prevProps.defaultMessage) {
      this.setState({message: this.props.defaultMessage})
    }
  }

  componentWillUnmount () {
    key.deleteScope('compose')
  }

  render () {
    // TODO: Add GIFs, image upload

    const {topic, mod} = this.props
    const {showEmoji, message} = this.state
    return <div style={styles.container}>
      {
        topic && <div style={styles.topicContainer}>
          <div style={styles.nametagIconContainer}>
            <NametagIcon
              image={mod.image}
              name={mod.name}
              diameter={20} />
          </div>
          <div id='topic' style={styles.topic}>{topic}</div>
        </div>
      }
      <div style={styles.compose} id='compose'>
        <Popover
          open={showEmoji}
          anchorEl={document.getElementById('compose')}
          overlayStyle={{opacity: 0}}
          onRequestClose={this.toggleEmoji(false)}>
          <Picker
            set='emojione'
            emoji='dancer'
            title='Skin Tone'
            onClick={emoji => this.setState({message: message + emoji.colons})} />
        </Popover>
        <IconButton
          onClick={this.toggleEmoji(!showEmoji)}>
          <FontIcon
            className='material-icons'>
            tag_faces
          </FontIcon>
        </IconButton>
        <form onSubmit={this.post} style={styles.form} onClick={this.toggleEmoji(false)}>
          <TextField
            name='compose'
            id='composeTextInput'
            style={styles.textfield}
            onChange={this.onChange}
            autoComplete='off'
            multiLine
            value={this.state.message} />
          <FlatButton
            style={styles.sendButton}
            id='sendMessageButton'
            type='submit'
            icon={
              <FontIcon
                className='material-icons'>
                send
              </FontIcon>
              } />
        </form>
      </div>
    </div>
  }
}

const {string, func, shape} = PropTypes

Compose.propTypes = {
  roomId: string.isRequired,
  myNametag: shape({
    id: string.isRequired,
    name: string.isRequired
  }).isRequired,
  createMessage: func.isRequired,
  defaultMessage: string,
  topic: string,
  mod: shape({
    name: string.isRequired,
    image: string.isRequired
  }),
  onUpdateText: func,
  onPost: func
}

export default radium(Compose)

const styles = {
  container: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    flexDirection: 'column',
    borderCollapse: 'separate',
    paddingBottom: 20,
    paddingTop: 10,
    background: '#FFF',
    width: 'calc(100% - 300px)',
    paddingRight: 15,
    zIndex: 40,
    marginLeft: 290,
    [mobile]: {
      marginLeft: 20,
      width: 'calc(100% - 40px)'
    }
  },
  emojiSelector: {
    background: 'none',
    boxShadow: 'none'
  },
  nametagIconContainer: {
    marginRight: 5
  },
  topic: {
    fontStyle: 'italic',
    fontSize: 18,
    color: grey
  },
  topicContainer: {
    display: 'flex',
    paddingLeft: 25
  },
  compose: {
    display: 'flex'
  },
  showEmoji: {
    cursor: 'pointer',
    fontSize: 18
  },
  textfield: {
    flex: 1,
    width: '100%'
  },
  mobileSelector: {
    left: 20,
    width: 'inherit'
  },
  sendButton: {
    minWidth: 45
  },
  form: {
    flex: 1,
    display: 'flex'
  },
  mentionMenu: {
    maxHeight: '50vh'
  }
}
