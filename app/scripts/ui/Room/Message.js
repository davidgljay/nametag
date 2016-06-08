import React, { Component, PropTypes } from 'react';
import moment from '../../../bower_components/moment/moment';
import ModAction from './ModAction';
import errorLog from '../../utils/errorLog';

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
    const authorRef = new Firebase(process.env.FIREBASE_URL +
      'participants/' + this.props.roomId + '/' + this.props.author);
    authorRef.on('value', function onValue(author) {
      self.setState(function setState(previousState) {
        previousState.author = author.val();
        previousState.author.id = this.props.author;
        return previousState;
      });
    }, errorLog('Error getting message author info'), this);
  }

  componentWillUnmount() {
    const authorRef = new Firebase(process.env.FIREBASE_URL +
      'participants/' + this.props.roomId + '/' + this.props.author);
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

  render() {
    let icon, name, below;
    if (this.state.author) {
      icon = this.state.author.icon;
      name = this.state.author.name;
    }

    if (this.state.mouseOver) {
      below =
        <div className="actions">
          <span
            className="glyphicon glyphicon-heart"
            onClick={this.heartAction}
            aria-hidden="true"/>
          <span
            className="glyphicon glyphicon-flag"
            onClick={this.modAction(true)}
            aria-hidden="true"/>
        </div>; 
    } else {
      below =
        <div className="date">
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
        className="message"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <td className="icon">
          <img className="img-circle" src={icon}/>
        </td>
        <td className="messageText">
          <div className="name">{name}</div>
          <div className="text">{this.props.text}</div>
          {below}
          <div className="msgPadding"></div>
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
