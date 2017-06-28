import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Media from './Media'
import MessageMenu from './MessageMenu'
import MentionMenu from './MentionMenu'
import ModAction from './ModAction'
import {grey500, grey800, lightBlue100, yellow100} from 'material-ui/styles/colors'
import ReactMarkdown from 'react-markdown'
import {primary, white} from '../../../styles/colors'

class Message extends Component {

  constructor (props) {
    super(props)
    this.state = {modAction: false, showActions: false, showMenu: null}

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
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      this.setState({
        showMenu: this.state.showMenu ? null : e.currentTarget
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
        saved
      },
      norms,
      roomId,
      mod,
      toggleSaved,
      myNametag,
      createMessage,
      hideDMs,
      setDefaultMessage
    } = this.props

    const {showMenu, showActions, modAction} = this.state

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
        {
          recipient.image
          ? <img style={styles.tinyIconImg} src={recipient.image} />
        : <div style={{...styles.tinyIconImg, ...styles.tinyDefaultImage}}>{author.name.slice(0, 2)}</div>
        }
      </div>
    } else if (recipient.id === myNametag.id) {
      messageStyle = {...styles.messageText, ...styles.directMessageIncoming}
      callout = <div style={styles.dmCallout}>Private Message</div>
    } else {

    }

    return <div>
      <tr
        className='message'
        style={styles.message}
        id={id}
        onClick={() => this.setState({showActions: !showActions})}>
        <td style={styles.image} onClick={this.toggleMenu}>
          {
            author.image
            ? <img style={styles.imageImg} src={author.image} />
            : <div style={{...styles.imageImg, ...styles.defaultImage}}>{author.name.slice(0, 2)}</div>
          }
        </td>
        <td style={messageStyle}>
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
              source={text}
              escapeHtml />
          </div>
          {media}
          <div style={styles.below}>
            {
              <MessageMenu
                showModAction={this.showModAction}
                showActions={showActions}
                isDM={recipient !== null}
                toggleSaved={toggleSaved}
                saved={saved}
                id={id} />
            }
            <div style={styles.date}>
              {moment(createdAt).format('h:mm A, ddd MMM DD YYYY')}
            </div>
          </div>
          <MentionMenu
            name={author.name}
            hideDMs={hideDMs}
            showMenu={showMenu}
            toggleMenu={this.toggleMenu}
            setDefaultMessage={setDefaultMessage} />
        </td>
      </tr>
      {
        this.state.modAction &&
        <ModAction
          msgId={id}
          author={author}
          norms={norms}
          text={text}
          mod={mod}
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
  mod: object.isRequired,
  hideDMs: bool.isRequired,
  setDefaultMessage: func.isRequired
}

export default Message

const styles = {
  message: {
    paddingTop: 10,
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10
  },
  directMessageIncoming: {
    backgroundColor: lightBlue100
  },
  directMessageOutgoing: {
    backgroundColor: yellow100
  },
  dmCallout: {
    color: grey800,
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
    display: 'inline-block',
    cursor: 'pointer'
  },
  date: {
    fontSize: 10,
    fontStyle: 'italic',
    color: grey500,
    height: 22,
    display: 'inline-block'
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
