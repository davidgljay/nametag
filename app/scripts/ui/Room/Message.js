import React, { Component, PropTypes } from 'react';
import moment from '../../../bower_components/moment/moment';
import ModAction from './ModAction';
import Media from './Media';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';
import style from '../../../styles/Room/Message.css';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: {},
      mouseOver: false,
      modAction: false,
    };
  }

  componentDidMount() {
    // TODO: Does this belong in getInitialState of componentDidMount?
    // It seems like it's bad to set state before the component mounts, so maybe here?
    const self = this;
    const authorRef = fbase.child('nametags/' + this.props.roomId +
      '/' + this.props.author);
    authorRef.on('value', function onValue(author) {
      if (author.val()) {
        self.setState(function setState(prevState) {
          prevState.author = author.val();
          prevState.author.id = this.props.author;
          return prevState;
        });
      }
    }, errorLog('Error getting message author info'), this);
  }

  componentWillUnmount() {
    const authorRef = fbase.child('nametags/' + this.props.roomId +
      '/' + this.props.author);
    authorRef.off();
  }

  onMouseEnter() {
    // TODO: Figure out ok for mobile (no mouseover)
    this.setState({mouseOver: true});
  }

  onMouseLeave() {
    this.setState({mouseOver: false});
  }

  modAction(open) {
    const self = this;
    return function onClick() {
      self.setState({modAction: open});
    };
  }

  heartAction() {
    return function onClick() {
      // TODO: Add heart action;
    };
  }

  checkYouTube(message) {
    return /[^ ]+youtube\.com[^ \.\!]+/.exec(message);
  }

  checkImage(message) {
    return /[^ ]+(\.gif|\.jpg|\.png)/.exec(message);
  }

  render() {
    let icon;
    let name;
    let below;
    let media;
    if (this.state.author) {
      icon = this.state.author.icon;
      name = this.state.author.name;
    }

    if (this.checkYouTube(this.props.text)) {
      media = <Media url={this.checkYouTube(this.props.text)[0]}/>;
    } else if (this.checkImage(this.props.text)) {
      media = <Media url={this.checkImage(this.props.text)[0]}/>;
    }

    if (this.state.mouseOver) {
      below =
        <div className={style.actions}>
          <span className={style.actionIcon + ' glyphicon glyphicon-heart'}
          aria-hidden="true"
          onClick={this.heartAction.bind(this)}/>
          <span
            className={style.actionIcon + ' glyphicon glyphicon-flag'}
            onClick={this.modAction(true).bind(this)}
            aria-hidden="true"/>
        </div>;
    } else {
      below =
        <div className={style.date}>
          {moment(this.props.timestamp).format('h:mm A, ddd MMM DD YYYY')}
        </div>;
    }

    if (this.state.modAction) {
      below =
        <ModAction
          roomId={this.props.roomId}
          msgId={this.props.id}
          author={this.state.author}
          close={this.modAction(false)}/>;
    }

    return <tr
        className={style.message}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}>
        <td className={style.icon}>
          <img className="img-circle" src={icon}/>
        </td>
        <td className={style.messageText}>
          <div className={style.name}>{name}</div>
          <div className={style.text}>{this.props.text}</div>
          {media}
          {below}
          <div className={style.msgPadding}></div>
        </td>
      </tr>;
  }
}

Message.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  date: PropTypes.number,
  author: PropTypes.string,
  roomid: PropTypes.string,
};
Message.defaultProps = {
  id: 'msg1',
  text: 'This is the testiest message.',
  timestamp: 1461977139344,
};

export default Message;
