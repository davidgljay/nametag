import React, { Component, PropTypes } from 'react'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Emojis from '../Utils/Emojis'
import key from 'keymaster'

class Compose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false,
      showMentionMenu: false
    }

    this.onChange = (e) => {
      if (e.target.value.slice(-1) === '@') {
        this.setState({showMentionMenu: true})
      } else if (e.target.value.slice(-1) === ' ') {
        this.setState({showMentionMenu: false})
      }
      this.setState({message: e.target.value})
    }

    this.post = (e) => {
      const {myNametag, roomId} = this.props
      e.preventDefault()
      if (this.state.message.length > 0) {
        let message = {
          text: this.state.message,
          author: myNametag.id,
          room: roomId
        }
        this.setState({message: '', showEmoji: false, showMentionMenu: false})
        this.props.createMessage(message, myNametag)
      }
    }
    this.toggleEmoji = (open) => () => {
      this.setState({showEmoji: open})
    }

    this.handleEmoji = (emoji) => {
      this.setState({message: this.state.message + ':' + emoji + ':'})
    }

    this.nametagList = () => {
      const query = /@\S+/.exec(this.state.message).slice(1)
      return this.props.nametags.filter(n => n.name.match(query))
        .map(n => n.name)
    }

    this.addMention = (mention) => {
      this.setState({
        message: this.state.message.replace(/@\S+(?=[^@]*$)/, mention)
      })
    }
  }

  componentWillMount () {
    key('enter', 'compose', this.post)
  }

  componentDidUpdate (prevProps) {
    if (this.props.defaultMessage !== prevProps.defaultMessage) {
      this.setState({message: this.props.defaultMessage})
    }
  }

  componentWillUnmount () {
    key.deleteScope('compose')
  }

  render () {
    // TODO: Add GIFs, image upload

    const {showEmoji, message} = this.state
    return <div style={styles.compose} id='compose'>
      <div style={styles.spacer} />
      <Emojis
        open={showEmoji}
        closeModal={this.toggleEmoji(false)}
        onEmojiClick={emoji => this.setState({message: message + emoji})} />
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
  }
}

Compose.propTypes = {
  roomId: PropTypes.string.isRequired,
  myNametag: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  createMessage: PropTypes.func.isRequired,
  defaultMessage: PropTypes.string
}

export default radium(Compose)

const styles = {
  compose: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    borderCollapse: 'separate',
    paddingBottom: 20,
    paddingTop: 10,
    background: '#FFF',
    width: '100%',
    paddingRight: 15,
    zIndex: 40
  },
  spacer: {
    width: 290,
    [mobile]: {
      width: 20
    }
  },
  showEmoji: {
    cursor: 'pointer',
    fontSize: 18
  },
  textfield: {
    flex: 1,
    width: 'inherit'
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
  }
}
