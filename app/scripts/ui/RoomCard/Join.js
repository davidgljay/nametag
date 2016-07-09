import React, { Component, PropTypes } from 'react';
import errorLog  from '../../utils/errorLog';
import Login  from '../User/Login';
import EditNametag  from '../Nametag/EditNametag';
import UserCertificates  from '../Certificate/UserCertificates';
import Alert  from '../Utils/Alert';
import fbase from '../../api/firebase';
import style from '../../../styles/RoomCard/Join.css';


class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      nametag: {
        name: '',
        bio: '',
        icon: '',
        certificates: [],
      },
    };
  }

  addNametagCertificate(cert) {
    this.setState(function setState(prevState) {
      let unique = true;
      // Check to prevent duplicate certificate entries;
      for (let i = prevState.nametag.certificates.length - 1; i >= 0; i--) {
        if (cert.id === prevState.nametag.certificates[i].id) {
          unique = false;
        }
      }
      if (unique) {
        prevState.nametag.certificates.push(cert);
      }
      return prevState;
    });
  }

  removeNametagCertificate(certId) {
    this.setState(function setState(prevState) {
      // Check to prevent duplicate certificate entries;
      for (let i = prevState.nametag.certificates.length - 1; i >= 0; i--) {
        if (certId === prevState.nametag.certificates[i].id) {
          prevState.nametag.certificates.splice(i, 1);
        }
      }
      return prevState;
    });
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
      this.checkIfJoined();
    }
  }

  componentWillUpdate() {
    if (this.state.nametag.name.length === 0 && this.context.userAuth) {
      this.checkIfJoined();
    }
  }

  componentWillUnmount() {
    if (this.state.defaults) {
      const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid);
      defaultsRef.off('value');
    }
  }

  checkIfJoined() {
    //Check to see if the user has already joined this room.
    const userRoomRef = fbase.child('user_rooms/' + this.context.userAuth.uid + '/' + this.props.roomId);
    userRoomRef.on('value', function onValue(value) {
      if (value.val()) {
        this.loadNametag(value.val().nametag_id);
      } else {
        this.setDefaults();
      }
    },errorLog("Getting user_room in Join component"),this)

  }

  setDefaults() {
    //Load user's default nametag settings
    const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid);
    defaultsRef.on('value', function setDefault(value) {
      this.setState(function setState(prevState) {
        prevState.defaults = value.val();
        prevState.nametag.name = prevState.defaults && prevState.defaults.names ? prevState.defaults.names[0] : '';
        prevState.nametag.icon = prevState.defaults && prevState.defaults.icons ? prevState.defaults.icons[0] : '';
        return prevState;
      });
    }, errorLog('Setting defaults in Join component'),this);
  }

  loadNametag(nametagId) {
    //Load existing nametag for this room.
    const nametagRef = fbase.child('nametags/' + this.props.roomId + '/' + nametagId);
    return nametagRef.on('value', function onValue(value) {
      this.setState(function setState(prevState) {
        prevState.nametag = value.val();
        prevState.nametagId = value.key();
        prevState.nametag.certificates = prevState.nametag.certificates || [];
        return prevState;
      });
    }, errorLog("Getting nametag in Join component"), this);
  }

  updateUrl() {
   window.location = '/#/rooms/' + this.props.roomId;
  }

// TODO: Use existing nametagid if one is present.
  joinRoom() {
    let self = this;
    if (!this.props.normsChecked) {
      this.setState({
        'alert': 'You must agree to the norms above ' +
        'in order to join this conversation.',
      });
    } else {
      const nametagRef = fbase.child('nametags/' + this.props.roomId);
      if (this.state.nametagId) {
        nametagRef.child(this.state.nametagId)
          .set(this.state.nametag)
          .then(function() {
            self.updateUrl();
          }, errorLog("Joining room "), this);
      } else {
        nametagRef.push(this.state.nametag)
          .then(function(nametagref) {
            return fbase.child('user_rooms/' + this.context.userAuth.uid + '/' + this.props.roomId)
                .set({
                  mod: false,
                  creator: false,
                  nametag_id: nametagref.key(),
                });
          }, errorLog('Updating user room in Join component'))
          .then(function() {
            self.updateUrl();
          }, errorLog('Joining room '));
      }


    }
  }

  render() {
    let join;
    if (this.context.userAuth) {
      join =
        <div id={style.join}>
          <Alert alertType='danger' alert={this.state.alert}/>
          <h4>Write Your Nametag For This Conversation</h4>
          <EditNametag
            nametag={this.state.nametag}
            updateNametag={this.updateNametag.bind(this)}
            addNametagCertificate={this.addNametagCertificate.bind(this)}
            removeNametagCertificate={this.removeNametagCertificate.bind(this)} />
          <div id={style.userCertificates}>
            <p className={style.userCertificateText}>
              Click to view your certificates.<br/>
              Drag them over to show them in this conversation.
            </p>
            <UserCertificates/>
          </div>
          <br/>
          <button
            className={style.btnPrimary}
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
