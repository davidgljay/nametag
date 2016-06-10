import React, { Component, PropTypes} from 'react';
import Message from './Message';
import ModActionNotif from './ModActionNotif';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: {},
      modActions: {},
      startTime: Date.now(),
    };
  }

  componentDidMount() {
    const self = this;

    // Add messages for display
    const messageListRef = fbase.child('room_messages/' + this.props.roomId);
    messageListRef.on('child_added', function onChildAded(value) {
      const mId = value.val();
      const messageRef = fbase.child('messages/' + mId);
      messageRef.on('value', function onValue(messageObj) {
        if (!messageObj.exists()) {
          return;
        }

        // Scroll to the bottom if the message was created before the user entered the room.
        let message = messageObj.val();
        message.id = messageObj.key();

        self.setState(function setState(previousState) {
          previousState.messages[message.id] = message;
          return previousState;
        });

        // TODO: Animate scrolling
        window.scrollBy(0, 90);
      });
    }, errorLog('Error getting room from FB'), this);


    // Add mod actions to state for display
    const modActionPubRef = fbase.child('mod_actions/' + this.props.roomId + '/public');
    const modActionPrivRef = fbase.child('mod_actions/' + this.props.roomId + '/private/' +
      this.props.participantId);

    function addModAction(data) {
      let modAction = data.val();
      modAction.msgId = data.key();
      self.setState(function setState(previousState) {
        previousState.modActions[modAction.msgId] = modAction;
        return previousState;
      });
    }

    modActionPubRef.on('child_added', addModAction, errorLog('Error adding public mod actions'));
    modActionPrivRef.on('child_added', addModAction, errorLog('Error adding private mod actions'));
  }

  componentWillUnmount() {
    const modActionPubRef = fbase.child('mod_actions/' + this.props.roomId + '/public');
    const modActionPrivRef = fbase.child('mod_actions/' + this.props.roomId + '/private/' +
      this.props.participantId);
    const messageListRef = fbase.child('room_messages/' + this.props.roomId);

    modActionPubRef.off('child_added');
    modActionPrivRef.off('child_added');
    messageListRef.off('child_added');

    for (let message in this.state.messages) {
      if ({}.hasOwnProperty.call(this.state.messages, message)) {
        const messageRef = fbase.child(    '/messages/' + message);
        messageRef.off('value');
      }
    }
  }

  render() {
    let messages = [];
    let self = this;
    // Add messages and ModActions to a single array and sort by timestamp
    for (let message in this.state.messages) {
      if ({}.hasOwnProperty.call(this.state.messages, message)) {
        const msgData = this.state.messages[message];
        msgData.type = 'message';
        messages.push(msgData);
      }
    }
    for (let modAction in this.state.modActions) {
      if ({}.hasOwnProperty.call(this.state.modActions, modAction)) {
        const maData = this.state.modActions[modAction];
        maData.type = 'modAction';
        messages.push(maData);
      }
    }
    messages.sort(function msgSort(a, b) {
      return a.timestamp - b.timestamp;
    });

    // TODO: remove bootstrap formatting and make full width;

    return <div id="messages">
        <table id="msgContainer">
          <tbody>
          {messages.map(function mapMessages(message) {
            if (message.type === 'message') {
              return (
                <Message
                  id={message.id}
                  text={message.text}
                  timestamp={message.timestamp}
                  author={message.author}
                  roomId={self.props.roomId}
                  key={message.id}/>
              );
            } else if (message.type === 'modAction') {
              return (
                  <ModActionNotif
                    id={'ma' + message.msgId}
                    modAction={message}
                    roomId={self.props.roomId}
                    key={'ma' + message.msgId}/>
                );
            }
          })}
          </tbody>
        </table>
      </div>;
  }
}

Messages.propTypes = {
  roomId: PropTypes.string,
  participantId: PropTypes.string,
};
Messages.defaultProps = { roomId: 'stampi' };

export default Messages;
