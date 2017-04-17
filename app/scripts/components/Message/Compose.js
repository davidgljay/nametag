import React, { Component, PropTypes } from 'react'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Emojis from '../Utils/Emojis'

class Compose extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false
    }
    this.onChange = this.onChange.bind(this)
    this.post = this.post.bind(this)
    this.toggleEmoji = this.toggleEmoji.bind(this)
    this.handleEmoji = this.handleEmoji.bind(this)
  }

  onChange (e) {
    this.setState({message: e.target.value})
  }

  toggleEmoji () {
    this.setState({showEmoji: !this.state.showEmoji})
  }

  handleEmoji (emoji) {
    this.setState({message: this.state.message + ':' + emoji + ':'})
  }

  post (e) {
    const {myNametag, roomId} = this.props
    e.preventDefault()
    if (this.state.message.length > 0) {
      let message = {
        text: this.state.message,
        author: myNametag.id,
        room: roomId
      }
      this.setState({message: '', showEmoji: false})
      this.props.createMessage(message, myNametag)
    }
  }

  render () {
    // TODO: Add GIFs, image upload

    // Workaround for mobile sizing since Radium doesn't appear to work.
    // const selectorStyle = window.innerWidth < 800
    // ? {...styles.selectorStyle, ...styles.mobileSelector} : styles.selectorStyle
    const {showEmoji, message} = this.state
    return <div style={styles.compose}>
      <div style={styles.spacer} />
      {
        <Emojis
          open={showEmoji}
          closeModal={() => this.setState({showEmoji: false})}
          onEmojiClick={emoji => this.setState({message: message + emoji})} />
      }
      <IconButton
        onClick={this.toggleEmoji}>
        <FontIcon
          className='material-icons'>
          insert_emotimage
        </FontIcon>
      </IconButton>
      <form onSubmit={this.post} style={styles.form}>
        <TextField
          name='compose'
          style={styles.textfield}
          onChange={this.onChange}
          autoComplete='off'
          value={this.state.message} />
        <FlatButton
          style={styles.sendButton}
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
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  createMessage: PropTypes.func.isRequired
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
  selectorStyle: {
    bottom: 75,
    left: 300,
    position: 'fixed',
    background: '#fff',
    width: '50%',
    height: 250,
    overflow: 'scroll',
    padding: 5,
    border: '1px solid #ccc',
    borderRadius: 3
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
