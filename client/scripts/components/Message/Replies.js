import React, {PropTypes, Component} from 'react'
import Message from '../Message/Message'
import Compose from '../Message/Compose'
import Dialog from 'material-ui/Dialog'
import {track, setTimer, increment} from '../../utils/analytics'

class Replies extends Component {

  constructor (props) {
    super(props)

    this.state = {defaultMessage: ''}

    this.onPost = (post) => {
      const {closeReply} = this.props
      track('REPLY_POST')
      increment('MESSAGES_POSTED')
      closeReply()
    }

    this.setDefaultMessage = (defaultMessage) => this.setState({defaultMessage})
  }

  componentDidMount () {
    setTimer('REPLY_POST')
  }

  render () {
    const {
        createMessage,
        replies,
        roomId,
        myNametag,
        deleteMessage,
        banNametag,
        addReaction,
        setEditing,
        toggleEmoji,
        setRecipient,
        parent,
        norms,
        hideDMs,
        showReplies,
        closeReply,
        mod
      } = this.props

    const {defaultMessage} = this.state

    console.log('Replies', replies, showReplies)

    return <div className='replies'>
      <Dialog
        modal={false}
        contentStyle={styles.dialog}
        bodyStyle={styles.bodyStyle}
        open={showReplies}
        onRequestClose={closeReply}>
        <h3 style={styles.header}>Reply</h3>
        <Compose
          roomId={roomId}
          myNametag={myNametag}
          createMessage={createMessage}
          defaultMessage={defaultMessage}
          editMessage={() => {}}
          mod={mod}
          parent={parent}
          topic=''
          onPost={this.onPost}
          onUpdateText={this.onUpdateText}
          />
        <div style={styles.cardsContainer}>
          {
            replies.map((reply, i) => {
              return <Message
                message={reply}
                roomId={roomId}
                key={reply.id}
                id={reply.id}
                hideDMs={hideDMs}
                hideAuthor={
                  i > 0 &&
                  replies[i - 1].author &&
                  !!reply.author &&
                  reply.author.id === replies[i - 1].author.id
                }
                toggleEmoji={toggleEmoji}
                deleteMessage={deleteMessage}
                banNametag={banNametag}
                addReaction={addReaction}
                setDefaultMessage={this.setDefaultMessage}
                setRecipient={setRecipient}
                setEditing={setEditing}
                norms={norms}
                mod={mod}
                createMessage={createMessage}
                myNametag={myNametag} />
            }
            )
          }
        </div>
      </Dialog>
    </div>
  }
}

const {func, string, bool, arrayOf, shape, object} = PropTypes

Replies.propTypes = {
  createMessage: func.isRequired,
  replies: arrayOf(shape({
    id: string.isRequired
  }).isRequired),
  roomId: string.isRequired,
  parent: string.isRequired,
  myNametag: object.isRequired,
  deleteMessage: func.isRequired,
  banNametag: func.isRequired,
  addReaction: func.isRequired,
  setRecipient: func.isRequired,
  setEditing: func.isRequired,
  toggleEmoji: func.isRequired,
  norms: arrayOf(
    string.isRequired
  ),
  hideDMs: bool.isRequired,
  mod: object.isRequired,
  showReplies: bool.isRequired,
  closeReply: func.isRequired
}

export default Replies

const styles = {
  header: {
    marginTop: 0,
    fontWeight: 300
  },
  card: {
    width: 240,
    minHeight: 60,
    margin: 5,
    padding: 5
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '50vh',
    paddingBottom: 30,
    marginTop: 20
  }
}
