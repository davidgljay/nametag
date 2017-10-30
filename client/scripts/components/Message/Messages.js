import React, { Component, PropTypes} from 'react'
import Message from './Message'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'
import HelpMessage from './HelpMessage'
import Popover from 'material-ui/Popover'
import {Picker} from 'emoji-mart'

class Messages extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showEmoji: ''
    }

    this.mapMessage = (message, i) => {
      const {
        norms,
        roomId,
        myNametag,
        mod,
        createMessage,
        messages,
        addReaction,
        setDefaultMessage,
        setRecipient,
        setEditing,
        hideDMs,
        deleteMessage,
        banNametag
      } = this.props

      return <Message
        message={message}
        roomId={roomId}
        key={message.id}
        hideDMs={hideDMs}
        hideAuthor={i > 0 &&
          messages[i - 1].author &&
          !!message.author &&
          message.author.id === messages[i - 1].author.id
        }
        toggleEmoji={this.toggleEmoji}
        deleteMessage={deleteMessage}
        banNametag={banNametag}
        addReaction={addReaction}
        setDefaultMessage={setDefaultMessage}
        setRecipient={setRecipient}
        setEditing={setEditing}
        norms={norms}
        mod={mod}
        createMessage={createMessage}
        myNametag={myNametag} />
    }

    this.scroll = () => {
      let counter = 0
      let timer = setInterval(() => {
        window.scrollBy(0, 2)
        if (counter >= 50) {
          clearInterval(timer)
        }
        counter++
      }, 0)
    }

    this.toggleEmoji = (id) => (e) => {
      this.setState({showEmoji: id})
    }

    this.addReaction = (emoji) => {
      const {addReaction, myNametag} = this.props
      const {showEmoji} = this.state
      addReaction(showEmoji, emoji.colons, myNametag.id)
      this.setState({showEmoji: ''})
    }
  }

  componentDidMount () {
    const {messages} = this.props
    if (messages.length > 0) {
      document.getElementById(messages[messages.length - 1].id).scrollIntoView()
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.messages.length !== this.props.messages.length) {
      // this.scroll()
    }
  }

  render () {
    const {messages, myNametag, mod} = this.props
    const {showEmoji} = this.state
    return <div style={styles.messages} id='messages'>
      <Popover
        open={!!showEmoji}
        anchorEl={document.getElementById('compose')}
        overlayStyle={{opacity: 0}}
        onRequestClose={this.toggleEmoji('')}>
        <Picker
          set='emojione'
          emoji='dancer'
          title='Skin Tone'
          onClick={this.addReaction} />
      </Popover>
      <div style={styles.msgContainer}>
        {
          mod && myNametag &&
          mod.id === myNametag.id &&
          <HelpMessage
            text='Leave a few messages to set the tone, then invite a few people in to get things started. Just share a link to this room.' />
        }
        {
          messages.map(this.mapMessage)
        }
      </div>
    </div>
  }
}

const {string, arrayOf, object, func, bool, shape} = PropTypes

Messages.propTypes = {
  roomId: string.isRequired,
  messages: arrayOf(object).isRequired,
  createMessage: func.isRequired,
  myNametag: shape({
    id: string.isRequired
  }),
  hideDMs: bool.isRequired,
  deleteMessage: func.isRequired,
  banNametag: func.isRequired,
  addReaction: func.isRequired,
  setDefaultMessage: func.isRequired,
  setRecipient: func.isRequired,
  setEditing: func.isRequired
}

export default radium(Messages)

const styles = {
  messages: {
    minHeight: '100vh',
    height: '100%',
    width: 'calc(100% - 275px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingLeft: 275,
    paddingTop: 100,
    scrollBehavior: 'smooth',
    [mobile]: {
      paddingLeft: 0,
      width: '100%'
    }
  },
  msgContainer: {
    marginBottom: 100
  }
}
