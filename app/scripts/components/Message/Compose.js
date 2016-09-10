import React, { Component, PropTypes } from 'react'
import style from '../../../styles/Message/Compose.css'

class Compose extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
    this.onChange = this.onChange.bind(this)
    this.post = this.post.bind(this)
  }

  onChange(e) {
    this.setState({message: e.target.value})
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
      this.props.addMessage(Object.assign({}, message, {id: tempId}), tempId)
      this.props.addRoomMessage(message.room, tempId)
      this.props.postMessage(message)
    }
  }

  render() {
    // TODO: Add GIFs, image upload, emoticons
    return <form className={style.compose} onSubmit={this.post}>
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
