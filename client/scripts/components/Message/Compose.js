import React, { Component, PropTypes } from 'react'
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
import t from '../../utils/i18n'
import {track, increment} from '../../utils/analytics'

class Compose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false,
      lastTypingPrompt: 0
    }

    this.onChange = (e) => {
      const text = e.target.value
      const {onUpdateText} = this.props
      if (onUpdateText) {
        onUpdateText(text)
      }

      // Post a prompt that the user is typing once every 2 seconds at most
      // Temporarily disabling, as this seems to slow down typing noticably
      // if (showTypingPrompt && Date.now() - lastTypingPrompt > 4000) {
        // this.setState({lastTypingPrompt: Date.now()})
        // showTypingPrompt(myNametag.id, roomId)
      // }

      if (text.slice(-1) === '\n') {
        this.post(e)
        return
      }
      this.setState({
        message: text
      })
    }

    this.post = (e) => {
      const {
        myNametag,
        roomId,
        createMessage,
        setDefaultMessage,
        setRecipient,
        onPost,
        recipient,
        closed,
        editing,
        parent,
        editMessage,
        setEditing
      } = this.props
      const {message} = this.state
      if (closed) {
        return
      }
      e.preventDefault()
      if (editing && editMessage) {
        editMessage(editing, roomId, message)
        setEditing(null)
        setDefaultMessage('')
        track('EDIT_MESSAGE', {room: roomId})
        return
      }
      if (onPost) {
        onPost(message)
      }
      track('POST_MESSAGE', {room: roomId})
      increment('MESSAGES_POSTED')
      if (message.length > 0 && myNametag) {
        let msg = {
          text: emojiText.convert(message, {delimiter: ':'}),
          author: myNametag.id,
          room: roomId
        }
        if (recipient) {
          msg.recipient = recipient
        }
        if (parent) {
          msg.parent = parent
        }
        this.setState({message: '', showEmoji: false, showMentionMenu: false})
        createMessage(msg, myNametag)
        if (setDefaultMessage) {
          setDefaultMessage('')
        }
        if (setRecipient) {
          setRecipient(null)
        }
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

    const {
      topic,
      mod,
      nametags,
      recipient,
      editing,
      setRecipient,
      setEditing,
      setDefaultMessage,
      closed,
      hintText
  } = this.props
    const {showEmoji, message} = this.state
    let calloutImage
    let calloutName
    let calloutMsg
    if (recipient) {
      const nametag = nametags.filter(n => n.id === recipient)[0]
      calloutImage = nametag.image
      calloutName = nametag.name
      calloutMsg = t('message.private', nametag.name)
    } else if (editing) {
      calloutMsg = t('message.editing')
    } else if (topic) {
      calloutImage = mod.image
      calloutName = mod.name
      calloutMsg = topic
    }
    return <div>
      {
        calloutMsg && <div style={styles.topicContainer}>
          {
            calloutImage &&
            <div style={styles.nametagIconContainer}>
              <NametagIcon
                image={calloutImage}
                name={calloutName}
                diameter={20} />
            </div>
          }
          <div id='topic' style={styles.topic}>
            {calloutMsg}
          </div>
          {
            recipient &&
            <div style={styles.cancelContainer}>
              <a href='#' style={styles.cancel} onClick={() => setRecipient(null)}>{t('cancel')}</a>
            </div>
          }
          {
            editing &&
            <div style={styles.cancelContainer}>
              <a href='#' style={styles.cancel} onClick={() => {
                setEditing(null)
                setDefaultMessage('')
              }}>{t('cancel')}</a>
            </div>
          }
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
            title={t('message.skin_tone')}
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
            hintText={hintText}
            disabled={closed}
            multiLine
            value={this.state.message} />
          {
            !closed &&
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
          }
        </form>
      </div>
    </div>
  }
}

const {string, func, shape, arrayOf, bool} = PropTypes

Compose.propTypes = {
  roomId: string.isRequired,
  myNametag: shape({
    id: string.isRequired,
    name: string.isRequired
  }),
  createMessage: func.isRequired,
  editMessage: func,
  recipient: string,
  parent: string,
  defaultMessage: string,
  setDefaultMessage: func,
  topic: string,
  mod: shape({
    name: string.isRequired,
    image: string.isRequired
  }),
  nametags: arrayOf(shape({
    id: string.isRequired,
    name: string.isRequired,
    image: string
  })),
  editing: string,
  hintText: string,
  onUpdateText: func,
  onPost: func,
  showTypingPrompt: func,
  setRecipient: func,
  setEditing: func,
  closed: bool
}

export default Compose

const styles = {
  emojiSelector: {
    background: 'none',
    boxShadow: 'none'
  },
  nametagIconContainer: {
    marginRight: 5
  },
  topic: {
    fontStyle: 'italic',
    fontSize: 14,
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
  cancelContainer: {
    flex: 1,
    textAlign: 'right'
  },
  cancel: {
    textDecoration: 'none',
    fontStyle: 'italic',
    fontSize: 12
  }
}
