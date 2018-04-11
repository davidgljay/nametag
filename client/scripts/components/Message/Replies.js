import React, {PropTypes, Component} from 'react'
import Message from '../Message/Message'
import Compose from '../Message/Compose'
import NametagIcon from '../Nametag/NametagIcon'
import Dialog from 'material-ui/Dialog'
import FontIcon from 'material-ui/FontIcon'
import {track, setTimer, increment} from '../../utils/analytics'
import t from '../../utils/i18n'

class Replies extends Component {

  constructor (props) {
    super(props)

    this.state = {defaultMessage: '', editingReply: ''}

    this.onPost = (post) => {
      track('REPLY_POST')
      increment('MESSAGES_POSTED')
    }

    this.setEditing = (editingReply) => this.setState({editingReply})

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
        editMessage,
        toggleEmoji,
        setRecipient,
        parent,
        open,
        toggleNametagImageMenu,
        norms,
        hideDMs,
        closeReply,
        acceptBadge,
        canGrantBadges,
        setBadgeGrantee,
        mod
      } = this.props

    const {defaultMessage, editingReply} = this.state

    return <div className='replies'>
      {
        open &&
        <Dialog
          modal={false}
          contentStyle={styles.dialog}
          open={open}
          bodyStyle={styles.cardBody}
          onRequestClose={closeReply}>
          <FontIcon
            style={styles.close}
            className='material-icons'
            onClick={closeReply}>
                close
              </FontIcon>
          <h3 style={styles.header}>
            <div>{t('message.reply_to')}</div>
            <div style={styles.nametagIconStyle}>
              {
                parent.author
                ? <NametagIcon
                  image={parent.author.image}
                  name={parent.author.name}
                  diameter={30} />
                : <NametagIcon
                  image={parent.nametag.image}
                  name={parent.nametag.name}
                  diameter={30} />
              }
            </div>
          </h3>
          <div style={editingReply ? styles.editingContainer : {}}>
            <Compose
              roomId={roomId}
              myNametag={myNametag}
              createMessage={createMessage}
              defaultMessage={defaultMessage}
              setDefaultMessage={this.setDefaultMessage}
              editing={editingReply}
              setEditing={this.setEditing}
              editMessage={editMessage}
              mod={mod}
              parent={parent.id}
              topic=''
              onPost={this.onPost} />
          </div>
          <div style={styles.cardsContainer}>
            {
              [parent].concat(replies).map((reply, i) =>
                <div className={`reply${i}`} key={reply.id}>
                  <Message
                    message={reply}
                    roomId={roomId}
                    id={reply.id}
                    hideDMs={hideDMs}
                    setBadgeGrantee={setBadgeGrantee}
                    canGrantBadges={canGrantBadges}
                    acceptBadge={acceptBadge}
                    hideAuthor={
                      i > 1 &&
                      replies[i - 2].author &&
                      !!reply.author &&
                      reply.author.id === replies[i - 2].author.id
                    }
                    toggleEmoji={toggleEmoji}
                    deleteMessage={deleteMessage}
                    banNametag={banNametag}
                    addReaction={addReaction}
                    setDefaultMessage={this.setDefaultMessage}
                    setRecipient={setRecipient}
                    setEditing={this.setEditing}
                    toggleNametagImageMenu={toggleNametagImageMenu}
                    norms={norms}
                    mod={mod}
                    createMessage={createMessage}
                    myNametag={myNametag} />
                </div>
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
  roomId: string.isRequired,
  parent: shape({
    id: string.isRequired,
    author: shape({
      name: string.isRequired,
      image: string
    })
  }).isRequired,
  myNametag: object.isRequired,
  deleteMessage: func.isRequired,
  banNametag: func.isRequired,
  addReaction: func.isRequired,
  setRecipient: func.isRequired,
  editMessage: func.isRequired,
  toggleEmoji: func.isRequired,
  norms: arrayOf(
    string.isRequired
  ),
  open: bool.isRequired,
  hideDMs: bool.isRequired,
  mod: object.isRequired,
  closeReply: func.isRequired,
  setBadgeGrantee: func.isRequired,
  acceptBadge: func.isRequired,
  canGrantBadges: bool.isRequired,
  toggleNametagImageMenu: func.isRequired
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
  },
  editingContainer: {
    background: '#f3f3f3',
    borderTop: '2px solid rgba(168, 168, 168, 0.75)'
  }
}
