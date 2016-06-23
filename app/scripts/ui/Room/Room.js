import React, { Component, PropTypes } from 'react';
import Nametags from '../Nametag/Nametags';
import Messages from './Messages';
import Compose from './Compose';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {
        title: '',
        norms: [],
      },
    };
  }

  // TODO: update user_rooms to user_nametags, add logic to detect curently logged in user;

  getChildContext() {
    return {
      nametagId: this.props.nametagId,
      roomId: this.props.params.roomId,
    };
  }

  componentDidMount() {
  	// TODO: mark the user as active in the room.
    const roomRef = fbase.child('/rooms/' + this.props.params.roomId);

    roomRef.on('value', function onValye(value) {
      this.setState({room: value.val()});
    }, errorLog('Error getting room from FB'), this);
  }

  componentWillUnmount() {
    const roomRef = fbase.child('rooms/' + this.props.params.roomId);
    roomRef.off('value');
  	// TODO: mark the user as inactive when they leave the room.
  }

  render() {
    // TODO: Move norms to stateless object
    return (
    	<div>
    	    <div className="header">
                <ul className="nav nav-pills pull-right">
                    <li>
                      <a href="#">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                      </a>
                    </li>
                </ul>
                <h3 className="text-muted">{this.state.room.title}</h3>
              <div id="description">{this.state.room.description}</div>
          </div>
          <div>
            <div id="leftBar">
              <div id="leftBarContent">
                <div id="norms">
                  <h4>Norms:</h4>
                  <ul id="normlist">
                    {this.state.room.norms.map(function(norm) {
                      return (
                        <li key={norm} className="norm">
                          {norm}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Nametags roomId={this.context.roomId} mod={this.props.mod}/>
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
            NametagId={this.props.NametagId}/>
      </div>
    );
  }
}

Room.propTypes = { roomId: PropTypes.string };
Room.defaultProps = {
  roomId: 'stampi',
  NametagId: 'wxyz',
};
Room.childContextTypes = {
  nametagId: PropTypes.string,
  roomId: PropTypes.string,
};

export default Room;