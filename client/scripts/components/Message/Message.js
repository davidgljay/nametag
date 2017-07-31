import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Media from './Media'
import MessageMenu from './MessageMenu'
import MentionMenu from './MentionMenu'
import CommandMenu from './CommandMenu'
import ModAction from './ModAction'
import NametagIcon from '../Nametag/NametagIcon'
import ReactMarkdown from 'react-markdown'
import EmojiText from './EmojiText'
import EmojiReactions from './EmojiReactions'
import {primary, white, grey} from '../../../styles/colors'
import {track} from '../../utils/analytics'

class Message extends Component {

  constructor (props) {
    super(props)
    this.state = {modAction: false, showActions: false, showMenu: ''}

    this.showModAction = (open) => (e) => {
      if (e) { e.preventDefault() }
      this.setState({modAction: open})
    }

    this.checkYouTube = (message) => {
      return /[^ ]+youtube\.com[^ .!]+/.exec(message)
    }

    this.checkImage = (message) => {
      return /[^ ]+(\.gif|\.jpg|\.png)/.exec(message)
    }

    this.toggleMenu = e => {
      const {myNametag, message: {author}} = this.props
      if (!this.state.showMenu) {
        track('MESSAGE_MENU_OPEN')
      }
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      const target = author.id === myNametag.id ? 'commands' : 'mentions'
      this.setState({
        showMenu: this.state.showMenu ? '' : target
      })
    }
  }

  render () {
    let media
    const {
      message: {
        id,
        author,
        createdAt,
        text,
        recipient,
        reactions
      },
      norms,
      roomId,
      mod,
      toggleEmoji,
      myNametag,
      addReaction,
      createMessage,
      deleteMessage,
      hideDMs,
      setDefaultMessage
    } = this.props

    const {showMenu, showActions} = this.state

    if (this.checkYouTube(text)) {
      media = <Media url={this.checkYouTube(text)[0]} />
    } else if (this.checkImage(text)) {
      media = <Media url={this.checkImage(text)[0]} />
    }

    // Get proper style if the this is a direct message
    let messageStyle
    let callout
    if (!recipient) {
      messageStyle = styles.messageText
    } else if (author.id === myNametag.id) {
      messageStyle = {...styles.messageText, ...styles.directMessageOutgoing}
      callout = <div style={styles.dmCallout}>
      Private Message to {recipient.name}
        <NametagIcon
          image={author.image}
          name={author.name}
          diameter={20} />
      </div>
    } else if (recipient.id === myNametag.id) {
      messageStyle = {...styles.messageText, ...styles.directMessageIncoming}
      callout = <div style={styles.dmCallout}>Private Message</div>
    }

    // Getting around Markdown's splitting of the '_' character in a hacky way for now
    const emojiText = text.replace(/(?=\S+)_(?=\S+:)/g, '~@~A~')

    const isMod = mod.id === author.id

    return <div>
      <div
        className='message'
        style={styles.message}
        id={id}
        onClick={() => this.setState({showActions: !showActions})}>
        <div style={styles.image} onClick={this.toggleMenu}>
          <NametagIcon
            image={author.image}
            name={author.name}
            diameter={50} />
        </div>
        <div style={messageStyle}>
          <div style={styles.name} onClick={this.toggleMenu}>
            {author.name}
          </div>
          {
            callout
          }
          <div style={styles.text} className='messageText'>
            <ReactMarkdown
              containerTagName={'span'}
              className={'messageText'}
              style={styles.text}
              renderers={{
                text: ({literal}) => {
                  const text = literal.replace(/~@~A~/g, '_')
                  return <EmojiText text={text} />
                }
              }}
              source={emojiText}
              escapeHtml />
          </div>
          {media}
          <div style={styles.below}>
            <EmojiReactions
              reactions={reactions}
              addReaction={addReaction}
              myNametagId={myNametag.id}
              messageId={id}
              />
            <MessageMenu
              showModAction={this.showModAction}
              showActions={showActions}
              isDM={recipient !== null}
              toggleEmoji={toggleEmoji}
              id={id} />
            <div style={styles.date}>
              {moment(createdAt).format('h:mm A, ddd MMM DD YYYY')}
            </div>
          </div>
          <MentionMenu
            name={author.name}
            hideDMs={hideDMs && !isMod}
            open={showMenu === 'mentions'}
            anchor={document.getElementById(id)}
            toggleMenu={this.toggleMenu}
            setDefaultMessage={setDefaultMessage} />
          <CommandMenu
            isMod={isMod}
            setDefaultMessage={setDefaultMessage}
            anchor={document.getElementById(id)}
            onRequestClose={this.toggleMenu}
            open={showMenu === 'commands'} />
        </div>
      </div>
      {
        this.state.modAction &&
        <ModAction
          msgId={id}
          author={author}
          norms={norms}
          text={text}
          mod={mod}
          deleteMessage={deleteMessage}
          myNametag={myNametag}
          close={this.showModAction(false)}
          roomId={roomId}
          createMessage={createMessage} />
      }
    </div>
  }
}

const {shape, string, bool, object, func, arrayOf} = PropTypes

Message.propTypes = {
  message: shape({
    id: string.isRequired,
    text: string.isRequired,
    createdAt: string.isRequired,
    author: shape({
      image: string,
      name: string.isRequired
    }).isRequired,
    recipient: shape({
      image: string,
      name: string.isRequired
    }),
    saved: bool
  }).isRequired,
  norms: arrayOf(string.isRequired).isRequired,
  roomId: string.isRequired,
  myNametag: shape({
    id: string.isRequired
  }).isRequired,
  createMessage: func.isRequired,
  addReaction: func.isRequired,
  mod: object.isRequired,
  deleteMessage: func.isRequired,
  hideDMs: bool.isRequired,
  setDefaultMessage: func.isRequired
}

export default Message

const styles = {
  message: {
    paddingTop: 10,
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10,
    display: 'flex'
  },
  directMessageIncoming: {
    backgroundColor: grey
  },
  directMessageOutgoing: {
    backgroundColor: grey
  },
  dmCallout: {
    color: grey,
    fontStyle: 'italic',
    display: 'inline-block',
    marginLeft: 10
  },
  messageText: {
    width: '100%',
    fontSize: 14,
    paddingRight: 40,
    paddingTop: 10,
    paddingLeft: 10,
    borderRadius: 5,
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word'
  },
  image: {
    paddingRight: 10,
    paddingLeft: 25,
    paddingTop: 10,
    minWidth: 50,
    verticalAlign: 'top',
    cursor: 'pointer'
  },
  below: {
    display: 'flex'
  },
  imageImg: {
    borderRadius: 25,
    width: 50,
    height: 50
  },
  tinyIconImg: {
    verticalAlign: 'middle',
    borderRadius: 10,
    width: 20,
    height: 20,
    display: 'inline-block',
    marginLeft: 5
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    cursor: 'pointer'
  },
  date: {
    fontSize: 10,
    fontStyle: 'italic',
    color: grey,
    height: 22,
    lineHeight: '22px'
  },
  text: {
    fontSize: 16
  },
  defaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '50px',
    fontSize: 22,
    color: white,
    cursor: 'default'
  },
  tinyDefaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: 10,
    fontStyle: 'normal',
    color: white,
    cursor: 'default'
  }
}
