import React, { Component, PropTypes } from 'react';
import Nametags from '../Nametag/Nametags';
import Messages from './Messages';
import Compose from './Compose';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';
import style from '../../../styles/Room/Room.css';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nametagId: '',
      room: {
        title: '',
        norms: [],
      },
    };
  }

  getChildContext() {
    return {
      nametagId: this.state.nametagId,
      roomId: this.props.params.roomId,
    };
  }

  componentDidMount() {
  	// TODO: mark the user as active in the room.
    const roomRef = fbase.child('/rooms/' + this.props.params.roomId);

    roomRef.on('value', function onValue(value) {
      this.setState({room: value.val()});
    }, errorLog('Error getting room from FB'), this);

    const nametagIdRef = fbase.child('user_rooms/'
      + this.context.userAuth.uid + '/'
      + this.props.params.roomId);

    nametagIdRef.on('value', function onValue(value) {
      this.setState({nametagId: value.val().nametag_id});
    });
  }

  componentWillUnmount() {
    const roomRef = fbase.child('rooms/' + this.props.params.roomId);
    roomRef.off('value');

    const nametagIdRef = fbase.child('user_rooms/'
     + this.context.userAuth.uid + '/'
     + this.props.params.roomId);
    nametagIdRef.off('value');
  	// TODO: mark the user as inactive when they leave the room.
  }

  render() {
    // TODO: Move norms to stateless object
    return (
    	<div>
    	    <div className={style.header}>
                 <img
                    src="/icons/close.svg"
                    className={style.close}/>
                <h3>{this.state.room.title}</h3>
              <div id={style.description}>{this.state.room.description}</div>
          </div>
          <div>
            <div id={style.leftBar}>
              <div id={style.leftBarContent}>
                <div id={style.norms}>
                  <h4>Norms:</h4>
                  <ul id={style.normlist}>
                    {this.state.room.norms.map(function(norm) {
                      return (
                        <li key={norm} className={style.norm}>
                          {norm}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Nametags roomId={this.props.params.roomId} mod={this.state.room.mod}/>
                <div className="footer">
                    <p>Built with ♥ by some queers</p>
                </div>
              </div>
            </div>
            <div id="chat">
              <Messages
              roomId={this.props.params.roomId}
              nametagId={this.props.NametagId}/>
            </div>
          </div>
          <Compose
            roomId={this.props.params.roomId}
            nametagId={this.state.nametagId}/>
      </div>
    );
  }
}

Room.propTypes = { roomId: PropTypes.string };
Room.defaultProps = {
  roomId: 'stampi',
  nametagId: 'wxyz',
};
Room.childContextTypes = {
  nametagId: PropTypes.string,
  roomId: PropTypes.string,
};

export default Room;
