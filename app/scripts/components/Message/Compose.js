import React, { Component, PropTypes } from 'react'
import EmojiPicker from 'react-simple-emoji'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

class Compose extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      showEmoji: false,
    }
    this.onChange = this.onChange.bind(this)
    this.post = this.post.bind(this)
    this.toggleEmoji = this.toggleEmoji.bind(this)
    this.handleEmoji = this.handleEmoji.bind(this)
  }

  onChange(e) {
    this.setState({message: e.target.value})
  }

  toggleEmoji() {
    this.setState({showEmoji: !this.state.showEmoji})
  }

  handleEmoji(emoji) {
    this.setState({message: this.state.message + ':' + emoji + ':'})
  }

  post(e) {
    e.preventDefault()
    if (this.state.message.length > 0) {
      let message = {
        text: this.state.message,
        timestamp: Date.now(),
        author: this.context.userNametag,
        room: this.context.room,
        type: 'message',
      }
      let tempId = new Date().getTime() + '_tempId'
      this.setState({message: ''})
      this.setState({showEmoji: false})
      this.props.addMessage(Object.assign({}, message, {id: tempId}), tempId)
      this.props.addRoomMessage(message.room, tempId)
      this.props.postMessage(message)
    }
  }


  render() {
    // TODO: Add GIFs, image upload, emoticons
    return <div style={styles.compose}>
      <EmojiPicker
        show={this.state.showEmoji}
        selectorStyle={styles.selectorStyle}
        selector={()=>null}
        handleEmoji={this.handleEmoji}/>
      <IconButton
        onClick={this.toggleEmoji}>
        <FontIcon
          className='material-icons'>
          insert_emoticon
        </FontIcon>
      </IconButton>
      <TextField
        name='compose'
        style={styles.textfield}
        onChange={this.onChange}
        value={this.state.message}/>
      <FlatButton
        style={styles.sendButton}
        icon={
          <FontIcon
            className='material-icons'
            onClick={this.post}>
            send
          </FontIcon>
          }/>
    </div>
  }
}

Compose.propTypes = {
  postMessage: PropTypes.func.isRequired,
}
Compose.contextTypes = {
  room: PropTypes.string.isRequired,
  userNametag: PropTypes.string.isRequired,
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
    paddingLeft: 250,
    paddingRight: 15,
    zIndex: 40,
    [mobile]: {
      paddingLeft: 30,
    },
  },
  showEmoji: {
    cursor: 'pointer',
    fontSize: 18,
  },
  textfield: {
    flex: 1,
    width: 'inherit',
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
    borderRadius: 3,
  },
  sendButton: {
    minWidth: 45,
  },
}
