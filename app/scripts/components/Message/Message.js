import React, { Component, PropTypes } from 'react'
import moment from '../../../bower_components/moment/moment'
import ModAction from '../ModAction/ModAction'
import Media from './Media'
import MessageMenu from './MessageMenu'
import emojis from 'react-emoji'
import {mobile} from '../../../styles/sizes'
import {grey500} from 'material-ui/styles/colors'

class Message extends Component {

  state = {modAction: false}

  modAction = (open) => {
    return (e) => {
      e.preventDefault()
      this.setState({modAction: open})
    }
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

    if (this.checkYouTube(this.props.text)) {
      media = <Media url={this.checkYouTube(this.props.text)[0]}/>
    } else if (this.checkImage(this.props.text)) {
      media = <Media url={this.checkImage(this.props.text)[0]}/>
    }

    if (this.state.modAction) {
      below =
        <ModAction
          msgId={this.props.id}
          author={this.props.author}
          close={this.modAction(false)}
          postMessage={this.props.postMessage}/>
    } else {
      below = <div style={styles.below}>
          <MessageMenu
            modAction={this.modAction}
            id = {this.props.id} />
          <div style={styles.date}>
              {moment(this.props.timestamp).format('h:mm A, ddd MMM DD YYYY')}
          </div>
        </div>
    }

    return <tr
        style={styles.message}>
        <td style={styles.icon}>
          <img style={styles.iconImg} src={this.props.author.icon}/>
        </td>
        <td style={styles.messageText}>
          <div style={styles.name}>{this.props.author.name}</div>
          <div style={styles.text}>{emojis.emojify(this.props.text)}</div>
          {media}
          {below}
          <div style={styles.msgPadding}></div>
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
  },
  messageText: {
    width: '100%',
    fontSize: 14,
    paddingRight: 20,
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  },
  icon: {
    paddingRight: 10,
    paddingLeft: 25,
    paddingTop: 5,
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
  msgPadding: {
    height: 15,
  },
}
