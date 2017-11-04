import React, {PropTypes, Component} from 'react'
import Message from '../Message/Message'
import Compose from '../Message/Compose'
import NametagIcon from '../Nametag/NametagIcon'
import Dialog from 'material-ui/Dialog'
import FontIcon from 'material-ui/FontIcon'
import {track, setTimer, increment} from '../../utils/analytics'

class Replies extends Component {

  constructor (props) {
    super(props)

    this.state = {defaultMessage: ''}

    this.onPost = (post) => {
      track('REPLY_POST')
      increment('MESSAGES_POSTED')
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
        parentAuthor,
        norms,
        hideDMs,
        showReplies,
        closeReply,
        mod
      } = this.props

    const {defaultMessage} = this.state

    return <div className='replies'>
      {
        showReplies &&
        <Dialog
          modal={false}
          contentStyle={styles.dialog}
          open={showReplies}
          bodyStyle={styles.cardBody}
          onRequestClose={closeReply}>
          <FontIcon
            style={styles.close}
            className='material-icons'
            onClick={closeReply}>
                close
              </FontIcon>
          <h3 style={styles.header}>
            <div>Reply To</div>
            <div style={styles.nametagIconStyle}>
              <NametagIcon
                image={parentAuthor.image}
                name={parentAuthor.name}
                diameter={30} />
            </div>
          </h3>
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
      }
    </div>
  }
}

const {func, string, bool, arrayOf, shape, object} = PropTypes

Replies.propTypes = {
  createMessage: func.isRequired,
  replies: arrayOf(shape({
    id: string.isRequired
  }).isRequired),
  parentAuthor: shape({
    name: string.isRequired,
    image: string
  }).isRequired,
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
    fontWeight: 300,
    display: 'flex',
    alignItems: 'center',
    padding: '24px 24px 0px 24px'
  },
  close: {
    fontSize: 18,
    float: 'right',
    padding: 10,
    cursor: 'pointer'
  },
  dialog: {
    width: '90%'
  },
  cardBody: {
    overflowY: 'auto',
    padding: 0
  },
  card: {
    width: 240,
    minHeight: 60,
    margin: 5,
    padding: 5,
    overflowY: 'scroll'
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '50vh',
    paddingBottom: 30,
    marginTop: 20
  },
  nametagIconStyle: {
    marginLeft: 10
  }
}
