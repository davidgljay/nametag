import React, { Component, PropTypes } from 'react';
import errorLog  from '../../utils/errorLog';
import Login  from '../User/Login';
import EditNametag  from '../Nametag/EditNametag';
import UserBadges  from '../Badge/UserBadges';
import Alert  from '../Utils/Alert';
import fbase from '../../api/firebase';

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
    if (this.context.userAuth) {
      const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid);
      defaultsRef.on('value', function setDefault(value) {
        self.setState(function setState(prevState) {
          prevState.defaults = value.val();
          prevState.nametag.name = prevState.defaults && prevState.defaults.names ? prevState.defaults.names[0] : 'Name';
          prevState.nametag.bio = prevState.defaults && prevState.defaults.bios ? prevState.defaults.bios[0] : 'Description';
          prevState.nametag.icon = prevState.defaults && prevState.defaults.icons ? prevState.defaults.icons[0] : '';
          return prevState;
        });
      });
    }
  }

  componentWillUnmount() {
    const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid);
    defaultsRef.off('value');
  }

  joinRoom() {
    if (!this.props.normsChecked) {
      this.setState({
        'alert': 'You must agree to the norms above' +
        'in order to join this conversation.',
      });
    } else {
      const NametagRef = fbase.child('nametags/' + this.props.roomId);
      NametagRef.push(this.state.Nametag);

      window.location = '/#/rooms/' + this.props.roomId;
    }
  }
  render() {
    let join;
    console.log(this.state.nametag);
    if (this.context.userAuth) {
      join =
        <div id="join">
          <Alert alertType='danger' alert={this.state.alert}/>
          <h4>Write Your Nametag For This Conversation</h4>
          <div id="userBadges">
            <p className="userBadgeText">
              Share these badges by dragging them onto your nametag.
            </p>
            <UserBadges/>
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
