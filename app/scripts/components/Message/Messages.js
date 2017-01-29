import React, { Component, PropTypes} from 'react'
import Message from './Message'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'
// import ModActionNotif from '../ModAction/ModActionNotif'

class Messages extends Component {

  constructor(props) {
    super(props)

    this.mapMessage = this.mapMessage.bind(this)
  }

  componentDidMount() {
    const {watchRoomMessages, room} = this.props
    watchRoomMessages(room)
  }

  componentWillUpdate(nextProps) {
    if (this.props.messageList &&
      nextProps.messageList &&
      nextProps.messageList.length > 1 &&
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
    const {unWatchRoomMessages, room} = this.props
    unWatchRoomMessages(room)
  }

  mapMessage(id) {
    const {messages, nametags, room, postMessage} = this.props
    if (!messages || !nametags) {return null}
    let message = messages[id]
    return message && <Message
        {...message}
        author={nametags[message.author]}
        roomId={room}
        key={message.id}
        postMessage={postMessage}/>
  }

  render() {
    const {messageList, messages} = this.props
    return <div style={styles.messages}>
        <table style={styles.msgContainer}>
          <tbody>
          {
            messageList &&
            messageList
              .sort((a, b) => messages[a].timestamp - messages[b].timestamp)
              .map(this.mapMessage)
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

export default radium(Messages)

const styles = {
  messages: {
    minHeight: '100vh',
    height: '100%',
    width: '100%',
    paddingLeft: 275,
    paddingTop: 100,
    scrollBehavior: 'smooth',
    [mobile]: {
      paddingLeft: 30,
    },
  },
  msgContainer: {
    width: 'inherit',
    marginBottom: 75,
  },
}
