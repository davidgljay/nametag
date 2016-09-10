import React, { Component, PropTypes} from 'react'
import Message from './Message'
// import ModActionNotif from '../ModAction/ModActionNotif'
import style from '../../../styles/Message/Messages.css'

class Messages extends Component {

  constructor(props) {
    super(props)

    this.mapMessage = this.mapMessage.bind(this)
  }

  componentDidMount() {
    this.props.watchRoomMessages(this.props.room)
  }

  componentWillUpdate(nextProps) {
    if (this.props.messageList &&
      nextProps.messageList &&
      nextProps.messageList.length > this.props.messageList.length) {
      let counter = 0
      let timer = setInterval(() => {
        window.scrollBy(0, 2)
        if (counter >= 50) {
          clearInterval(timer)
        }
        counter++
      }, 2)
    }
  }

  componentWillUnmount() {
    this.props.unWatchRoomMessages(this.props.room)
  }

  mapMessage(id) {
    if (!this.props.messages || !this.props.nametags) {return null}
    let component = null
    let message = this.props.messages[id]
    let author = this.props.nametags[message.author]
    if (message.type === 'message') {
      component = <Message
          {...message}
          author={author}
          roomId={this.props.room}
          key={message.id}
          postMessage={this.props.postMessage}/>
    } else if (message.type === 'modAction') {
      // component = <ModActionNotif
      //       id={'ma' + message.id}
      //       modAction={message}
      //       roomId={this.props.room}
      //       key={'ma' + message.id}/>
    }
    return component
  }

  render() {
    return <div id={style.messages}>
        <table id={style.msgContainer}>
          <tbody>
          {
            this.props.messageList &&
            this.props.messageList.map(this.mapMessage)
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
