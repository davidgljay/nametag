import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';

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
    console.log(this.props.roomId);
    const msgRef = new Firebase(process.env.FIREBASE_URL + '/messages');
    const rmMsgRef = new Firebase(process.env.FIREBASE_URL + '/room_messages/'
      + this.props.roomId);
    e.preventDefault();
    if (this.state.message.length > 0) {
      const newMsg = msgRef.push({
        text: this.state.message,
        timestamp: Date.now(),
        author: this.props.participantId,
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

Compose.propTypes = {roomId: PropTypes.string, participantId: PropTypes.string};

export default Compose;
