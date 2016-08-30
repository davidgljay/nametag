import React, { Component, PropTypes} from 'react'
// import Message from './Message'
// import ModActionNotif from '../ModAction/ModActionNotif'
import {watchRoomMessages, unWatchRoomMessages} from '../../actions/MessageActions'
import style from '../../../styles/Room/Messages.css'

class Messages extends Component {

  componentDidMount() {
    this.props.dispatch(watchRoomMessages(this.props.room))
  }

  componentWillUnmount() {
    this.props.dispatch(unWatchRoomMessages(this.props.room))
  }

  mapMessage(id) {
    let component = null
    let message = this.props.messages[id]
    if (message.type === 'message') {
      component = <Message
          id={message.id}
          text={message.text}
          timestamp={message.timestamp}
          author={message.author}
          roomId={this.props.room}
          key={message.id}/>
    } else if (message.type === 'modAction') {
      component = <ModActionNotif
            id={'ma' + message.id}
            modAction={message}
            roomId={this.props.room}
            key={'ma' + message.id}/>
    }
    return component
  }

  render() {
    return <div id={style.messages}>
        <table id={style.msgContainer}>
          <tbody>
          {
            // this.props.messages.map(this.mapMessage.bind(this))
          }
          </tbody>
        </table>
      </div>
  }
}

Messages.propTypes = {
  room: PropTypes.string.isRequired,
  messages: PropTypes.object,
  messageList: PropTypes.array,
}

export default Messages
