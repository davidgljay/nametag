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
    // TODO: Add autocomplete on click
    if (this.context.userAuth) {
      this.setDefaults();
    }
  }

  componentWillUpdate() {
    if (this.state.defaults === undefined && this.context.userAuth) {
      this.setDefaults();
    }
  }

  componentWillUnmount() {
    if (this.state.defaults) {
      const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid);
      defaultsRef.off('value');
    }
  }

  setDefaults() {
    let self = this;
    const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid);
    defaultsRef.on('value', function setDefault(value) {
      self.setState(function setState(prevState) {
        prevState.defaults = value.val();
        prevState.nametag.name = prevState.defaults && prevState.defaults.names ? prevState.defaults.names[0] : '';
        prevState.nametag.icon = prevState.defaults && prevState.defaults.icons ? prevState.defaults.icons[0] : '';
        return prevState;
      });
    });
  }


  joinRoom() {
    var self=this;
    if (!this.props.normsChecked) {
      this.setState({
        'alert': 'You must agree to the norms above' +
        'in order to join this conversation.',
      });
    } else {
      const NametagRef = fbase.child('nametags/' + this.props.roomId);
      NametagRef.push(this.state.nametag)
        .then(function(nametagref) {
          console.log('Set nametagref');
          return fbase.child('user_rooms/' + self.context.userAuth.uid + '/' + self.props.roomId)
              .set({
                mod: false,
                creator: false,
                nametag_id: nametagref.key(),
              });
        })
        .then(function() {
          window.location = '/#/rooms/' + self.props.roomId;
        }, errorLog("Joining room:"));


    }
  }
  render() {
    let join;
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
            updateNametag={this.updateNametag.bind(this)}/>
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
