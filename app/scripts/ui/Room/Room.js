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
      leftBarExpanded:false,
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
      const ntid = value.val().nametag_id;
      this.setState({nametagId: ntid});
    },this);
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

  closeRoom() {
    window.location = '/#/rooms/';
  }

  toggleLeftBar() {
    this.setState({leftBarExpanded: !this.state.leftBarExpanded});
  }

  render() {
    // TODO: Move norms to stateless object
    let room = <div>Loading</div>;
    let expanded = this.state.leftBarExpanded ? style.expanded : style.collapsed;

    if (this.state.nametagId) {
      room = <div>
    	    <div className={style.header}>
                 <span
                  onClick={this.closeRoom}
                  className={style.close + ' glyphicon glyphicon-remove'}/>
                <h3>{this.state.room.title}</h3>
              <div className={style.description}>
                {this.state.room.description}
              </div>
          </div>
          <div>
            <div id={style.leftBar} className={expanded}>
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
              </div>
              <div id={style.leftBarChevron}>
                <span 
                  onClick={this.toggleLeftBar.bind(this)}
                  className={'glyphicon glyphicon-chevron-right'}
                  />
              </div>
            </div>
              <Messages
                roomId={this.props.params.roomId}
                nametagId={this.state.nametagId}/>
          </div>
          <Compose
            roomId={this.props.params.roomId}
            nametagId={this.state.nametagId}/>
      </div>;
    };

    return room;
  }
}

Room.childContextTypes = {
  nametagId: PropTypes.string,
  roomId: PropTypes.string,
};
Room.contextTypes = {
    userAuth: PropTypes.object,
};

export default Room;
