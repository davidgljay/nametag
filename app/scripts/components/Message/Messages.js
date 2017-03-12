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

    this.scrollIfNeeded = (oldMessages, newMessages) => {
      const numNewMessages = Object.keys(newMessages).length
      const numPrevMessages = Object.keys(oldMessages).length
      if (numNewMessages > numPrevMessages && numPrevMessages === 0) {
        const lastMessage = this.prepArray(newMessages)[numNewMessages - 1]
        document.getElementById(lastMessage.id).scrollIntoViewIfNeeded()
      } else if (numNewMessages > numPrevMessages && numNewMessages > 3) {
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

    this.prepArray = (messages) =>
      Object.keys(messages)
      .reduce((p, id) => p.concat(messages[id]), [])
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  componentDidMount () {
    this.scrollIfNeeded([], this.props.messages)
  }

  componentDidUpdate (prevProps) {
    this.scrollIfNeeded(prevProps.messages, this.props.messages)
  }

  render () {
    const {messages = {}} = this.props
    return <div style={styles.messages}>
      <table style={styles.msgContainer}>
        <tbody>
          {
            this.prepArray(messages).map(this.mapMessage)
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
