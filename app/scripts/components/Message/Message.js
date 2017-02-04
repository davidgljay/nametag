import React, { Component, PropTypes } from 'react'
import moment from '../../../bower_components/moment/moment'
import ModAction from '../ModAction/ModAction'
import Media from './Media'
import MessageMenu from './MessageMenu'
import emojis from 'react-emoji'
import {mobile} from '../../../styles/sizes'
import {grey500, grey800, lightBlue100, yellow100} from 'material-ui/styles/colors'
import ReactMarkdown from 'react-markdown'

class Message extends Component {

  state = {modAction: false, showActions: false}

  modAction = (open) => (e) => {
    if (e) {e.preventDefault()}
    this.setState({modAction: open})
  }

  checkYouTube = (message) => {
    return /[^ ]+youtube\.com[^ \.\!]+/.exec(message)
  }

  checkImage = (message) => {
    return /[^ ]+(\.gif|\.jpg|\.png)/.exec(message)
  }

  render() {
    let below
    let media
    const {
      text,
      author,
      id,
      timestamp,
      postMessage,
      saveMessage,
      type,
      norms,
      saved
    } = this.props

    if (this.checkYouTube(text)) {
      media = <Media url={this.checkYouTube(text)[0]}/>
    } else if (this.checkImage(text)) {
      media = <Media url={this.checkImage(text)[0]}/>
    }

    if (this.state.modAction) {
      below =
        <ModAction
          msgId={id}
          author={author}
          norms={norms}
          text={text}
          close={this.modAction(false)}
          postMessage={postMessage}/>
    } else {
      below = <div style={styles.below}>
          <MessageMenu
            modAction={this.modAction}
            showActions={this.state.showActions}
            type={type}
            saveMessage={saveMessage}
            saved={saved}
            id={id} />
          <div style={styles.date}>
              {moment(timestamp).format('h:mm A, ddd MMM DD YYYY')}
          </div>
        </div>
    }

    // Get proper style if the this is a direct message
    let messageStyle
    switch (type) {
    case 'direct_message_from':
      messageStyle = {...styles.messageText, ...styles.directMessageFrom}
      break
    case 'direct_message_to':
      messageStyle = {...styles.messageText, ...styles.directMessageTo}
      break
    default:
      messageStyle = styles.messageText
    }

    return <tr
        style={styles.message}
        onClick={() => this.setState({showActions: !this.state.showActions})}>
        <td style={styles.icon}>
          <img style={styles.iconImg} src={author.icon}/>
        </td>
        <td style={messageStyle}>
          <div style={styles.name}>{author.name}</div>
          {
            type.slice(0, 14) === 'direct_message' &&
            <div style={styles.dmCallout}>Private Message</div>
          }
          <div style={styles.text}>
            {
              emojis.emojify(text).map((emojiText, i) => {
                return emojiText.props ? emojiText : <ReactMarkdown
                  key={i}
                  containerTagName={'span'}
                  className={'messageText'}
                  style={styles.text}
                  source={emojiText}
                  escapeHtml={true}/>
              })
            }
          </div>
          {media}
          {below}
        </td>
      </tr>
  }
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  author: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

export default Message

const styles = {
  message: {
    paddingTop: 10,
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  directMessageTo: {
    backgroundColor: lightBlue100,
  },
  directMessageFrom: {
    backgroundColor: yellow100,
  },
  dmCallout: {
    color: grey800,
    fontStyle: 'italic',
    display: 'inline-block',
    marginLeft: 10,
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
  },
  icon: {
    paddingRight: 10,
    paddingLeft: 25,
    paddingTop: 10,
    minWidth: 50,
    verticalAlign: 'top',
  },
  iconImg: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    display: 'inline-block',
  },
  date: {
    fontSize: 10,
    fontStyle: 'italic',
    color: grey500,
    height: 22,
    display: 'inline-block',
  },
  text: {
    fontSize: 16,
  },
}
