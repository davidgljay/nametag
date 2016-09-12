import React, { Component, PropTypes } from 'react'
import style from '../../../styles/Message/Compose.css'
import EmojiPicker from 'react-simple-emoji'
import { Icon } from 'react-mdl'

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
    return <div>
      <EmojiPicker
        show={this.state.showEmoji}
        selectorStyle={
          {
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
          }}
        selector={()=>null}
        handleEmoji={this.handleEmoji}/>
      <form className={style.compose} onSubmit={this.post}>
        <span className="input-group-addon">
            <Icon
              name="insert_emoticon"
              className={style.showEmoji}
              onClick={this.toggleEmoji}/>
        </span>
        <input
          type="text"
          className="form-control"
          onChange={this.onChange}
          value={this.state.message}/>
        <span className="input-group-btn">
          <button className="btn btn-secondary">
            <span className="glyphicon glyphicon-send" aria-hidden="true"/>
          </button>
        </span>
      </form>
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

export default Compose
