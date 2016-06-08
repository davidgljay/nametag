import React, { Component, PropTypes } from 'react';
import errorLog  from '../../utils/errorLog';
import Login  from '../Participant/Login';
import EditNametag  from '../Participant/EditNametag';
import Badges  from '../Participant/Badges';
import Alert  from '../Utils/Alert';

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      nametag: {
        name: '',
        bio: '',
        icon: '',
      },
    };
  }

  updateNametag(property) {
    const self = this;
    return function onClick(e) {
      const val = e.target.value;
      self.setState(function setState(prevState) {
        prevState.nametag[property] = val;
        return prevState;
      });
    };
  }

  componentDidMount() {
    const self = this;
    const defaultsRef = new Firebase(process.env.FIREBASE_URL +
      'user_defaults/' + this.context.userAuth.uid);
    defaultsRef.on('value', function setDefault(value) {
      self.setState(function setState(prevState) {
        prevState.defaults = value.val();
        prevState.nametag.name = prevState.defaults.names[0];
        prevState.nametag.bio = prevState.defaults.bios[0];
        prevState.nametag.icon = prevState.defaults.icons[0];
        return prevState;
      });
    });
  }

  componentWillUnmount() {
    const defaultsRef = new Firebase(process.env.FIREBASE_URL +
      'user_defaults/' + this.context.userAuth.uid);
    defaultsRef.off('value');
  }

  joinRoom() {
    if (!this.props.normsChecked) {
      this.setState({
        'alert': 'You must agree to the norms above' +
        'in order to join this conversation.',
      });
    } else {
      const participantRef = new Firebase(process.env.FIREBASE_URL +
        'participants/' + this.props.roomId);
      participantRef.push(this.state.participant);

      window.location = '/#/rooms/' + this.props.roomId;
    }
  }
  render() {
    let join;
    if (this.context.userAuth) {
      join =
        <div id="join">
          <Alert alertType='danger' alert={this.state.alert}/>
          <h4>Set Up Your Nametag For This Conversation</h4>
          <div id="userBadges">
            <p className="userBadgeText">
              Share these badges by dragging them onto your nametag.
            </p>
            <Badges/>
          </div>
          <EditNametag
            nametag={this.state.nametag}
            updateNametag={this.updateNametag}/>
          <br/>
          <button
            className="btn btn-primary"
            onClick={this.joinRoom.bind(this)}>
              Join
          </button>
        </div>;
    } else {
      join = <Login/>;
    }
    return join;
  }
}

Join.propTypes = {roomId: PropTypes.string, normsChecked: PropTypes.bool};
Join.contextTypes = {
  userAuth: PropTypes.object,
  checkAuth: PropTypes.func,
};

export default Join;
