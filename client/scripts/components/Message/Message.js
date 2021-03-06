import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import {Card} from 'material-ui/Card'
import Media from './Media'
import MessageMenu from './MessageMenu'
import MentionMenu from './MentionMenu'
import CommandMenu from './CommandMenu'
import ModAction from './ModAction'
import Replies from './Replies'
import Nametag from '../Nametag/Nametag'
import NametagIcon from '../Nametag/NametagIcon'
import ReactMarkdown from 'react-markdown'
import EmojiText from './EmojiText'
import FirstReply from './FirstReply'
import BadgeOffer from './BadgeOffer'
import EmojiReactions from './EmojiReactions'
import {primary, white, grey} from '../../../styles/colors'
import {track} from '../../utils/analytics'
import t from '../../utils/i18n'

class Message extends Component {

  constructor (props) {
    super(props)
    this.state = {
      modAction: false,
      showActions: false,
      showMenu: ''
    }

    this.showModAction = (open) => (e) => {
      if (e) { e.preventDefault() }
      this.setState({modAction: open})
    }

    this.showReplies = (open) => (e) => {
      const {message: {id, replies, replyCount}, getReplies, setVisibleReplies} = this.props
      if (e) { e.preventDefault() }
      if (replies.length < replyCount) {
        getReplies(id)
      }
      setVisibleReplies(open ? id : '')
    }

    this.checkYouTube = (message) => {
      return /[^ ]+youtube\.com[^ .!]+/.exec(message)
    }

    this.checkImage = (message) => {
      return /[^ (]+(\.gif|\.jpg|\.png)/.exec(message)
    }

    this.toggleMenu = open => e => {
      const {myNametag, message: {author, nametag}} = this.props
      if (open) {
        track('MESSAGE_MENU_OPEN')
      }
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      const target = (author && author.id === myNametag.id) ||
      (nametag && nametag.id === myNametag.id)
      ? 'commands' : 'mentions'
      this.setState({
        showMenu: open ? target : ''
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
        editedAt,
        text,
        recipient,
        reactions,
        parent,
        replies,
        replyCount,
        template,
        nametag
      },
      norms,
      roomId,
      mod,
      myBadges,
      visibleReplies,
      setVisibleReplies,
      toggleEmoji,
      myNametag,
      addReaction,
      setBadgeGrantee,
      canGrantBadges,
      hideAuthor,
      createMessage,
      editMessage,
      deleteMessage,
      banNametag,
      hideDMs,
      setDefaultMessage,
      setRecipient,
      acceptBadge,
      toggleNametagImageMenu,
      setEditing
    } = this.props

    const {showMenu, showActions} = this.state

    if (this.checkYouTube(text)) {
      media = <Media url={this.checkYouTube(text)[0]} />
    } else if (this.checkImage(text)) {
      media = <Media url={this.checkImage(text)[0]} />
    }

    const isReplyNotif = id.split('_')[0] === 'replyNotif'

    // Compress messages if they are sequentally from the same author
    let messageStyle = hideAuthor ? {...styles.messageText, ...styles.compressed} : styles.messageText
    let messageContainerStyle = styles.messageContainer
    if (hideAuthor) {
      messageContainerStyle = {...messageContainerStyle, ...styles.compressed}
    }
    if (!author && !nametag) {
      messageContainerStyle = {...messageContainerStyle, ...styles.helpMessageContainer}
    }
    if (isReplyNotif) {
      messageContainerStyle = {...messageContainerStyle, cursor: 'pointer'}
    }
    const imageStyle = hideAuthor ? {...styles.image, ...styles.compressed} : styles.image

    let callout
    if (!author) {
      messageStyle = {...styles.messageText, ...styles.helpMessage}
    } else if (author.id === myNametag.id && recipient) {
      messageStyle = {...styles.messageText, ...styles.directMessageOutgoing}
      callout = <div style={styles.dmCallout}>
      Private Message to {recipient.name}
        <NametagIcon
          image={author.image}
          name={author.name}
          style={styles.tinyIconImg}
          diameter={20} />
      </div>
    } else if (recipient && recipient.id === myNametag.id) {
      messageStyle = {...styles.messageText, ...styles.directMessageIncoming}
      callout = <div style={styles.dmCallout}>{t('message.private_msg')}</div>
    }

    // Getting around Markdown's splitting of the '_' character in a hacky way for now
    // Also, wrapping urls in brackets
    const emojiText = text
      .replace(/:\)/, ':slightly_smiling_face:')
      .replace(/:D/, ':grinning:')
      .replace(/:P/, ':stuck_out_tongue:')
      .replace(/:\(/, ':white_frowning_face:')
      .replace(/(?=\S+)_(?=\S+:)/g, '~@~A~')
      .replace(
        /(?![\w.,@?^/=%&:~+#-]*])(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?(?!])(.|$)/,
        (url) => `[${url}](${url})`)
    const hasLink = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))/.exec(emojiText)

    const isMod = !!author && mod.id === author.id
    const about = author || nametag

    return <div>
      <div
        className='message'
        style={messageContainerStyle}
        id={id}
        onClick={() => isReplyNotif
          ? setVisibleReplies(id.split('_')[1])
          : this.setState({showActions: !showActions})}>
        <div style={imageStyle} onClick={this.toggleMenu(true)}>
          {
            author && !hideAuthor && <NametagIcon
              image={author.image}
              name={author.name}
              diameter={50} />
          }
        </div>
        <div style={messageStyle}>
          {
            author && !hideAuthor && <div style={styles.name} onClick={this.toggleMenu(true)}>
              {author.name}
            </div>
          }
          {
            callout
          }
          <div className='messageText' onClick={hasLink ? () => {} : this.toggleMenu(true)}>
            <ReactMarkdown
              containerTagName={'span'}
              className={'messageText'}
              style={author ? styles.text : {...styles.text, ...styles.helpText}}
              renderers={{
                text: ({literal}) => {
                  const text = literal.replace(/~@~A~/g, '_')
                  return <EmojiText text={text} />
                },
                link: ({href}) => <a href={href} target='_blank'>{href}</a>
              }}
              source={emojiText}
              escapeHtml />
          </div>
          {media}
          {
            template &&
            <div>
              <BadgeOffer
                template={template}
                myBadges={myBadges}
                messageId={id}
                isRecipient={myNametag.id === recipient.id}
                acceptBadge={acceptBadge} />
            </div>
          }
          {
            nametag &&
            <div style={styles.nametagContainer} onClick={this.toggleMenu(true)}>
              <Card key={nametag.id} id={nametag.id} style={styles.nametag}>
                <Nametag
                  nametag={nametag}
                  myNametagId={myNametag.id}
                  modId={mod.id}
                  hideDMs={hideDMs} />
              </Card>
            </div>
          }
          {
            (author || nametag) &&
            <div style={styles.below}>
              <EmojiReactions
                reactions={reactions}
                addReaction={addReaction}
                myNametag={myNametag}
                messageId={id} />
              <MessageMenu
                showModAction={this.showModAction}
                showActions={showActions}
                showReplies={this.showReplies}
                isDM={!!recipient}
                isReply={!!parent}
                toggleEmoji={toggleEmoji}
                id={id} />
              <div style={styles.date}>
                {moment(createdAt).format('h:mm A, ddd MMM DD YYYY')}
              </div>
              {
                editedAt &&
                <div style={styles.date}>
                  {t('message.edited')}
                </div>
              }
            </div>
          }
          {
            !parent && replies.length > 0 &&
            <div style={styles.firstReply}>
              <FirstReply
                reply={replies[0]}
                showReplies={this.showReplies(true)}
                replyCount={replyCount} />
            </div>
          }
          {
            about &&
            <div>
              <MentionMenu
                nametagId={about.id}
                name={about.name}
                hideDMs={hideDMs && !isMod}
                open={showMenu === 'mentions'}
                anchor={document.getElementById(id)}
                toggleMenu={this.toggleMenu(false)}
                setBadgeGrantee={setBadgeGrantee}
                canGrantBadges={canGrantBadges}
                setDefaultMessage={setDefaultMessage}
                setRecipient={setRecipient} />
              <CommandMenu
                isMod={isMod}
                setDefaultMessage={setDefaultMessage}
                anchor={document.getElementById(id)}
                onRequestClose={this.toggleMenu(false)}
                messageId={id}
                messageText={text}
                roomId={roomId}
                deleteMessage={deleteMessage}
                setEditing={setEditing}
                toggleNametagImageMenu={toggleNametagImageMenu}
                open={showMenu === 'commands'} />
            </div>
          }
        </div>
      </div>
      {
        this.state.modAction &&
        <ModAction
          msgId={id}
          author={about}
          norms={norms}
          text={text}
          mod={mod}
          deleteMessage={deleteMessage}
          banNametag={banNametag}
          myNametag={myNametag}
          close={this.showModAction(false)}
          roomId={roomId}
          createMessage={createMessage} />
      }
      {
        !parent && (author || nametag) && <Replies
          createMessage={createMessage}
          replies={replies}
          roomId={roomId}
          parent={{
            id,
            author,
            createdAt,
            editedAt,
            text,
            recipient,
            reactions,
            parent: 'self',
            replies: [],
            replyCount: 0,
            nametag
          }}
          setBadgeGrantee={setBadgeGrantee}
          canGrantBadges={canGrantBadges}
          acceptBadge={acceptBadge}
          myNametag={myNametag}
          deleteMessage={deleteMessage}
          banNametag={banNametag}
          toggleEmoji={toggleEmoji}
          addReaction={addReaction}
          setRecipient={setRecipient}
          editMessage={editMessage}
          toggleNametagImageMenu={toggleNametagImageMenu}
          norms={norms}
          hideDMs={hideDMs}
          open={visibleReplies === id}
          closeReply={this.showReplies(false)}
          mod={mod} />
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
    editedAt: string,
    author: shape({
      image: string,
      name: string.isRequired
    }),
    recipient: shape({
      image: string,
      name: string.isRequired
    }),
    nametag: object,
    saved: bool
  }).isRequired,
  norms: arrayOf(string.isRequired).isRequired,
  roomId: string.isRequired,
  visibleReplies: string,
  myNametag: shape({
    id: string.isRequired
  }).isRequired,
  createMessage: func.isRequired,
  addReaction: func.isRequired,
  mod: object.isRequired,
  canGrantBadges: bool.isRequired,
  setBadgeGrantee: func.isRequired,
  deleteMessage: func.isRequired,
  banNametag: func.isRequired,
  hideDMs: bool.isRequired,
  hideAuthor: bool,
  setDefaultMessage: func.isRequired,
  setRecipient: func.isRequired,
  acceptBadge: func.isRequired,
  setEditing: func.isRequired,
  toggleNametagImageMenu: func.isRequired,
  editMessage: func,
  getReplies: func,
  setVisibleReplies: func
}

export default Message

const styles = {
  messageContainer: {
    marginTop: 2,
    marginBottom: 2,
    display: 'flex'
  },
  helpMessageContainer: {
    margin: 3,
    padding: 0
  },
  directMessageIncoming: {
    paddingTop: 10,
    backgroundColor: 'rgba(168, 168, 168, 0.05)',
    border: '1px solid rgba(168, 168, 168, 0.25)'
  },
  directMessageOutgoing: {
    paddingTop: 10,
    backgroundColor: 'rgba(168, 168, 168, 0.05)',
    border: '1px solid rgba(168, 168, 168, 0.25)'
  },
  dmCallout: {
    color: grey,
    fontStyle: 'italic',
    display: 'flex',
    marginLeft: 10,
    marginBottom: 10
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
    wordBreak: 'break-word',
    cursor: 'pointer'
  },
  helpMessage: {
    color: grey,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 3
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
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 5,
    cursor: 'pointer'
  },
  date: {
    fontSize: 10,
    fontStyle: 'italic',
    color: grey,
    height: 22,
    lineHeight: '22px',
    marginRight: 10
  },
  text: {
    fontSize: 16,
    fontWeight: 300
  },
  helpText: {
    fontSize: 12
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
  },
  compressed: {
    paddingTop: 0,
    marginTop: 0
  },
  nametag: {
    width: 240,
    marginTop: 10,
    marginBottom: 10,
    minHeight: 60,
    paddingBottom: 5
  },
  nametagContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}
