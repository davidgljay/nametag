import React, { Component, PropTypes} from 'react'
import Message from './Message'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'
import Popover from 'material-ui/Popover'
import {Picker} from 'emoji-mart'

class Messages extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showEmoji: ''
    }

    this.mapMessage = (message) => {
      const {
        norms,
        roomId,
        myNametag,
        mod,
        createMessage,
        setDefaultMessage,
        hideDMs,
        deleteMessage
      } = this.props
      return <Message
        message={message}
        roomId={roomId}
        key={message.id}
        hideDMs={hideDMs}
        toggleEmoji={this.toggleEmoji}
        deleteMessage={deleteMessage}
        setDefaultMessage={setDefaultMessage}
        norms={norms}
        mod={mod}
        createMessage={createMessage}
        myNametag={myNametag} />
    }

    this.scrollIfNeeded = (oldMessages, newMessages) => {
      const numNewMessages = newMessages.length
      const numPrevMessages = oldMessages.length
      if (numNewMessages > numPrevMessages && numNewMessages > 3) {
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

    this.toggleEmoji = (id) => (e) => {
      this.setState({showEmoji: id})
    }
  }

  componentDidMount () {
    const {messages} = this.props
    if (messages.length > 0) {
      document.getElementById(messages[messages.length - 1].id).scrollIntoView()
    }
  }

  componentDidUpdate (prevProps) {
    this.scrollIfNeeded(prevProps.messages, this.props.messages)
  }

  render () {
    const {messages} = this.props
    const {showEmoji} = this.state
    return <div style={styles.messages}>
      <Popover
        open={!!showEmoji}
        anchorEl={document.getElementById('compose')}
        overlayStyle={{opacity: 0}}
        onRequestClose={this.toggleEmoji('')}>
        <Picker
          set='emojione'
          autoFocus
          emoji='dancer'
          title='' />
      </Popover>
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

const {string, arrayOf, object, func, bool} = PropTypes

Messages.propTypes = {
  roomId: string.isRequired,
  messages: arrayOf(object).isRequired,
  createMessage: func.isRequired,
  toggleSaved: func.isRequired,
  myNametag: object.isRequired,
  hideDMs: bool.isRequired,
  deleteMessage: func.isRequired,
  setDefaultMessage: func.isRequired
}

export default radium(Messages)

const styles = {
  messages: {
    minHeight: '100vh',
    height: '100%',
    width: 'calc(100% - 275px)',
    display: 'flex',
    paddingLeft: 275,
    paddingTop: 100,
    scrollBehavior: 'smooth',
    [mobile]: {
      paddingLeft: 30,
      width: 'calc(100% - 30px)'
    }
  },
  msgContainer: {
    marginBottom: 100
  }
}
