import React, { Component, PropTypes} from 'react'
import Message from './Message'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'

class Messages extends Component {

  constructor (props) {
    super(props)

    this.mapMessage = (message) => {
      const {norms, roomId, myNametag} = this.props
      return <Message
        message={message}
        roomId={roomId}
        key={message.id}
        norms={norms}
        myNametag={myNametag} />
    }

    this.scrollIfNeeded = (oldMessages, newMessages) => {
      const numNewMessages = newMessages.length
      const numPrevMessages = oldMessages.length
      if (numNewMessages > numPrevMessages && numPrevMessages === 0) {
        const lastMessage = newMessages[numNewMessages - 1]
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
  }

  componentDidMount () {
    this.scrollIfNeeded([], this.props.messages)
  }

  componentDidUpdate (prevProps) {
    this.scrollIfNeeded(prevProps.messages, this.props.messages)
  }

  render () {
    const {messages} = this.props
    return <div style={styles.messages}>
      <table style={styles.msgContainer}>
        <tbody>
          {
            messages.map(this.mapMessage)
          }
        </tbody>
      </table>
    </div>
  }
}

Messages.propTypes = {
  roomId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  createMessage: PropTypes.func.isRequired,
  myNametag: PropTypes.string.isRequired
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
