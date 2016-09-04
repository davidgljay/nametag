import React, { Component, PropTypes } from 'react'
import moment from '../../../bower_components/moment/moment'
import ModAction from '../ModAction/ModAction'
import Media from './Media'
import MessageMenu from './MessageMenu'
import style from '../../../styles/Message/Message.css'

class Message extends Component {

  constructor(props) {
    super(props)
    this.state = {modAction: false}
    this.modAction = this.modAction.bind(this)
    this.heartAction = this.heartAction.bind(this)
    this.toggleActions = this.toggleActions.bind(this)
    this.checkYouTube = this.checkYouTube.bind(this)
    this.checkImage = this.checkImage.bind(this)
  }

  modAction(open) {
    return (e) => {
      e.preventDefault()
      this.setState({modAction: open})
    }
  }

  heartAction() {
    return function onClick() {
      // TODO: Add heart action
    }
  }

  toggleActions() {
    return this.setState({
      showActions:
      this.state.showActions === style.slideOutActions ? style.slideInActions : style.slideOutActions,
    })
  }

  checkYouTube(message) {
    return /[^ ]+youtube\.com[^ \.\!]+/.exec(message)
  }

  checkImage(message) {
    return /[^ ]+(\.gif|\.jpg|\.png)/.exec(message)
  }


  render() {
    let below
    let media

    // TODO: Replace heart with Emoji icon and display

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
          close={this.modAction(false)}/>
    } else {
      below = <div className={style.below}>
          <MessageMenu
            modAction={this.modAction}
            toggleActions={this.toggleActions}
            heartAction={this.heartAction}
            showActions={this.state.showActions}/>
          <div className={style.date}>
              {moment(this.props.timestamp).format('h:mm A, ddd MMM DD YYYY')}
          </div>
        </div>
    }

    return <tr
        className={style.message}>
        <td className={style.icon}>
          <img className="img-circle" src={this.props.author.icon}/>
        </td>
        <td className={style.messageText}>
          <div className={style.name}>{this.props.author.name}</div>
          <div className={style.text}>{this.props.text}</div>
          {media}
          {below}
          <div className={style.msgPadding}></div>
        </td>
      </tr>
  }
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  author: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

export default Message
