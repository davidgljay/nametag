import React, { Component, PropTypes } from 'react'
import errorLog  from '../../utils/errorLog'
import Login  from '../User/Login'
import EditNametag  from '../Nametag/EditNametag'
import UserCertificates  from '../Certificate/UserCertificates'
import Alert  from '../Utils/Alert'
import fbase from '../../api/firebase'
import style from '../../../styles/RoomCard/Join.css'

// TODO: Enable join login buttons via redux
// TODO: Enable join logged in via redux


class Join extends Component {
  constructor(props) {
    super(props)
    // TODO: move this to application state via Redux?
    this.state = {
      alert: null,
      nametag: {
        name: '',
        bio: '',
        icon: '',
        certificates: [],
      },
    }
  }

  // Make room action (check)
  // addNametagCertificate(cert) {
  //   this.setState(function setState(prevState) {
  //     let unique = true
  //     // Check to prevent duplicate certificate entries
  //     for (let i = prevState.nametag.certificates.length - 1; i >= 0; i--) {
  //       if (cert.id === prevState.nametag.certificates[i].id) {
  //         unique = false
  //       }
  //     }
  //     if (unique) {
  //       prevState.nametag.certificates.push(cert)
  //     }
  //     return prevState
  //   })
  // }

  // Make room action (check)
  // removeNametagCertificate(certId) {
  //   this.setState(function setState(prevState) {
  //     // Check to prevent duplicate certificate entries
  //     for (let i = prevState.nametag.certificates.length - 1; i >= 0; i--) {
  //       if (certId === prevState.nametag.certificates[i].id) {
  //         prevState.nametag.certificates.splice(i, 1)
  //       }
  //     }
  //     return prevState
  //   })
  // }

  // Make room action (these temporary nametags can
  // be part of app state until stored in nametags)
  // (check)
  updateNametag(property) {
    return (e) => {
      this.props.updateNametag(property, e.target.value);
    }
  }

  // componentDidMount() {
  //   // TODO: Add autocomplete on click
  //   if (this.context.userAuth) {
  //     this.checkIfJoined()
  //   }
  // }

  // componentWillUpdate() {
  //   if (this.state.nametag.name.length === 0 && this.context.userAuth) {
  //     this.checkIfJoined()
  //   }
  // }

  // componentWillUnmount() {
  //   if (this.state.defaults) {
  //     const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid)
  //     defaultsRef.off('value')
  //   }
  // }

  // TODO: Need to rethink. This seems tied to login.
  // Belongs in user action
  // On login I want to load user defaults into user
  // I also want to load default vals into each room
  // That eliminates this function
  // checkIfJoined() {
  //   //Check to see if the user has already joined this room.
  //   const userRoomRef = fbase.child('user_rooms/' + this.context.userAuth.uid + '/' + this.props.roomId)
  //   userRoomRef.on('value', function onValue(value) {
  //     if (value.val()) {
  //       this.loadNametag(value.val().nametag_id)
  //     } else {
  //       this.setDefaults()
  //     }
  //   }, errorLog('Getting user_room in Join component'), this)
  // }

  // TODO: Move to user action
  // This is handled by above function
  // setDefaults() {
  //   //Load user's default nametag settings
  //   const defaultsRef = fbase.child('user_defaults/' + this.context.userAuth.uid)
  //   defaultsRef.on('value', function setDefault(value) {
  //     this.setState(function setState(prevState) {
  //       prevState.defaults = value.val()
  //       prevState.nametag.name = prevState.defaults && prevState.defaults.names ? prevState.defaults.names[0] : ''
  //       prevState.nametag.icon = prevState.defaults && prevState.defaults.icons ? prevState.defaults.icons[0] : ''
  //       return prevState
  //     })
  //   }, errorLog('Setting defaults in Join component'), this)
  // }

  // TODO: Move to user action
  // Needs to be distinct room action
  // Shuold have no effect if user is not logged in
  // loadNametag(nametagId) {
  //   //Load existing nametag for this room.
  //   const nametagRef = fbase.child('nametags/' + this.props.roomId + '/' + nametagId)
  //   return nametagRef.on('value', function onValue(value) {
  //     this.setState(function setState(prevState) {
  //       prevState.nametag = value.val()
  //       prevState.nametagId = value.key()
  //       prevState.nametag.certificates = prevState.nametag.certificates || []
  //       return prevState
  //     })
  //   }, errorLog('Getting nametag in Join component'), this)
  // }

  updateUrl() {
    window.location = '/#/rooms/' + this.props.roomId
  }

  // TODO: Move to room action
  joinRoom() {
    let self = this
    if (!this.props.normsChecked) {
      this.setState({
        'alert': 'You must agree to the norms above ' +
        'in order to join this conversation.',
      })
    } else {
      const nametagRef = fbase.child('nametags/' + this.props.roomId)
      if (this.state.nametagId) {
        nametagRef.child(this.state.nametagId)
          .set(this.state.nametag)
          .then(function() {
            self.updateUrl()
          }, errorLog("Joining room "))
      } else {
        nametagRef.push(this.state.nametag)
          .then(function(nametagref) {
            return fbase.child('user_rooms/' + self.context.userAuth.uid + '/' + self.props.roomId)
                .set({
                  mod: false,
                  creator: false,
                  nametag_id: nametagref.key(),
                })
          }, errorLog('Updating user room in Join component'))
          .then(function() {
            self.updateUrl()
          }, errorLog('Joining room '))
      }


    }
  }

  render() {
    let join
    if (this.props.auth) {
      join =
        <div id={style.join}>
          <Alert alertType='danger' alert={this.state.alert}/>
          <h4>Write Your Nametag For This Conversation</h4>
          <EditNametag
            nametag={this.state.nametag}
            dispatch={this.props.dispatch}/>
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
        </div>
    } else {
      join = <Login dispatch={this.props.dispatch}/>
    }
    return join
  }
}

Join.propTypes = {
  roomId: PropTypes.string.isRequired,
  normsChecked: PropTypes.bool.isRequired,
  auth: PropTypes.object,
}

export default Join
