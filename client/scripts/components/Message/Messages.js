import React, { Component, PropTypes} from 'react'
import Message from './Message'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'
import HostMessage from './HostMessage'
import Popover from 'material-ui/Popover'
import GrantBadge from './GrantBadge'
import NTIconMenu from '../Nametag/IconMenu'
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
        grantableTemplates,
        createMessage,
        messages,
        me,
        addReaction,
        getReplies,
        setVisibleReplies,
        setBadgeGrantee,
        visibleReplies,
        setDefaultMessage,
        toggleNametagImageMenu,
        setRecipient,
        setEditing,
        editMessage,
        hideDMs,
        deleteMessage,
        banNametag,
        acceptBadge
      } = this.props

      return <div className={`message${i}`} key={message.id}>
        <Message
          message={message}
          roomId={roomId}
          hideDMs={hideDMs}
          hideAuthor={i > 0 &&
            messages[i - 1].author &&
            !!message.author &&
            message.author.id === messages[i - 1].author.id
          }
          toggleEmoji={this.toggleEmoji}
          deleteMessage={deleteMessage}
          banNametag={banNametag}
          getReplies={getReplies}
          canGrantBadges={grantableTemplates.length > 0}
          visibleReplies={visibleReplies}
          addReaction={addReaction}
          setBadgeGrantee={setBadgeGrantee}
          setVisibleReplies={setVisibleReplies}
          setDefaultMessage={setDefaultMessage}
          setRecipient={setRecipient}
          acceptBadge={acceptBadge}
          setEditing={setEditing}
          editMessage={editMessage}
          myBadges={me ? me.badges : []}
          norms={norms}
          mod={mod}
          toggleNametagImageMenu={toggleNametagImageMenu}
          createMessage={createMessage}
          myNametag={myNametag} />
      </div>
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
      this.scroll()
    }
  }

  render () {
    const {
      messages,
      myNametag,
      mod,
      grantableTemplates,
      badgeGrantee,
      setBadgeToGrant,
      setBadgeGrantee,
      setRecipient,
      showNametagImageMenu,
      toggleNametagImageMenu,
      updateNametag,
      shortLink,
      me
    } = this.props
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
      <Popover
        open={!!badgeGrantee}
        anchorEl={document.getElementById('compose')}
        overlayStyle={{opacity: 0}}
        onRequestClose={() => setBadgeGrantee('')}>
        <GrantBadge
          grantableTemplates={grantableTemplates}
          setBadgeToGrant={setBadgeToGrant}
          setBadgeGrantee={setBadgeGrantee}
          badgeGrantee={badgeGrantee}
          setRecipient={setRecipient} />
      </Popover>
      <Popover
        open={showNametagImageMenu}
        anchorEl={document.getElementById('compose')}
        overlayStyle={{opacity: 0}}
        onRequestClose={() => toggleNametagImageMenu(false)}>
        <NTIconMenu
          images={me ? me.images : []}
          image={myNametag ? myNametag.image : ''}
          about={myNametag ? myNametag.id : ''}
          showMenu
          toggleNametagImageMenu={toggleNametagImageMenu}
          updateNametag={updateNametag} />
      </Popover>
      <div style={styles.msgContainer}>
        {
          mod && myNametag &&
          mod.id === myNametag.id &&
          <HostMessage
            shortLink={shortLink} />
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
  shortLink: string.isRequired,
  messages: arrayOf(object).isRequired,
  createMessage: func.isRequired,
  myNametag: shape({
    id: string.isRequired
  }),
  me: shape({
    images: arrayOf(string).isRequired,
    badges: arrayOf(object).isRequired
  }),
  hideDMs: bool.isRequired,
  grantableTemplates: arrayOf(shape).isRequired,
  badgeGrantee: string.isRequired,
  visibleReplies: string.isRequired,
  deleteMessage: func.isRequired,
  banNametag: func.isRequired,
  addReaction: func.isRequired,
  editMessage: func.isRequired,
  getReplies: func.isRequired,
  setBadgeGrantee: func.isRequired,
  setBadgeToGrant: func.isRequired,
  setVisibleReplies: func.isRequired,
  setDefaultMessage: func.isRequired,
  setRecipient: func.isRequired,
  setEditing: func.isRequired,
  acceptBadge: func.isRequired,
  toggleNametagImageMenu: func.isRequired,
  showNametagImageMenu: bool.isRequired,
  updateNametag: func.isRequired
}

export default radium(Messages)

const styles = {
  messages: {
    minHeight: 'calc(100vh - 100px)',
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
