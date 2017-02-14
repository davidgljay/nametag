import React, { Component, PropTypes} from 'react'
import Message from './Message'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'

class Messages extends Component {

  constructor (props) {
    super(props)

    this.mapMessage = (message) => {
      const {nametags, room, norms, postMessage, saveMessage} = this.props
      if (!nametags) { return null }
      return message && <Message
        {...message}
        author={nametags[message.author]}
        roomId={room}
        recipient={nametags[message.recipient]}
        key={message.id}
        norms={norms}
        postMessage={postMessage}
        saveMessage={saveMessage} />
    }
  }

  componentWillUpdate (nextProps) {
    const numNewMessages = Object.keys(nextProps.messages).length
    const numPrevMessages = Object.keys(this.props.messages).length
    if (!this.props.messages ||
       numNewMessages < 3) {
      return
    } else if (numNewMessages - numPrevMessages > 5) {
      window.scrollBy(0, 100000)
    } else if (numNewMessages > numPrevMessages) {
      let counter = 0
      let timer = setInterval(() => {
        window.scrollBy(0, 2)
        if (counter >= 50) {
          clearInterval(timer)
        }
        counter++
      }, 0)
    }
  }

  render () {
    const {messages = {}} = this.props
    const messageList = Object.keys(messages)
    .reduce((p, id) => p.concat(messages[id]), [])
    .sort((a, b) => a.timestamp - b.timestamp)
    return <div style={styles.messages}>
      <table style={styles.msgContainer}>
        <tbody>
          {
            messageList.map(this.mapMessage)
          }
        </tbody>
      </table>
    </div>
  }
}

Messages.propTypes = {
  room: PropTypes.string.isRequired,
  messages: PropTypes.object,
  postMessage: PropTypes.func.isRequired,
  nametags: PropTypes.object.isRequired
}

export default radium(Messages)

const styles = {
  messages: {
    minHeight: '100vh',
    height: '100%',
    display: 'flex',
    paddingLeft: 275,
    paddingTop: 100,
    scrollBehavior: 'smooth',
    [mobile]: {
      paddingLeft: 30
    }
  },
  msgContainer: {
    width: 'inherit',
    marginBottom: 75
  }
}
