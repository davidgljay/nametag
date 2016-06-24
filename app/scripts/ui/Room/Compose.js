import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';

class Compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  onChange(e) {
    this.setState({message: e.target.value});
  }

  post(e) {
    const msgRef = fbase.child('messages');
    const rmMsgRef = fbase.child('room_messages/' + this.props.roomId);
    e.preventDefault();
    if (this.state.message.length > 0) {
      const newMsg = msgRef.push({
        text: this.state.message,
        timestamp: Date.now(),
        author: this.props.nametagId,
      }, function fbPushResponse(err) {
        if (err) {
          errorLog('Error posting message')(err);
        }
      });
      rmMsgRef.push(newMsg.key());
      this.setState({message: ''});
    }
  }

  render() {
    // TODO: Add GIFs, image upload, emoticons
    return <form id="compose" className="input-group" onSubmit={this.post.bind(this)}>
        <input
          type="text"
          className="form-control"
          onChange={this.onChange.bind(this)}
          value={this.state.message}/>
        <span className="input-group-btn">
          <button className="btn btn-secondary">
            <span className="glyphicon glyphicon-send" aria-hidden="true"/>
          </button>
        </span>
      </form>;
  }
}

Compose.propTypes = {roomId: PropTypes.string.isRequired, nametagId: PropTypes.string.isRequired};

export default Compose;
