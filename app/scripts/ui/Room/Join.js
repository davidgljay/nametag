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

  updateUrl() {
    window.location = '/#/rooms/' + this.props.roomId
  }

  // TODO: Move to room action
  // joinRoom() {
  //   let self = this
  //   if (!this.props.normsChecked) {
  //     this.setState({
  //       'alert': 'You must agree to the norms above ' +
  //       'in order to join this conversation.',
  //     })
  //   } else {
  //     const nametagRef = fbase.child('nametags/' + this.props.roomId)
  //     if (this.state.nametagId) {
  //       nametagRef.child(this.state.nametagId)
  //         .set(this.state.nametag)
  //         .then(function() {
  //           self.updateUrl()
  //         }, errorLog("Joining room "))
  //     } else {
  //       nametagRef.push(this.state.nametag)
  //         .then(function(nametagref) {
  //           return fbase.child('user_rooms/' + self.context.userAuth.uid + '/' + self.props.roomId)
  //               .set({
  //                 mod: false,
  //                 creator: false,
  //                 nametag_id: nametagref.key(),
  //               })
  //         }, errorLog('Updating user room in Join component'))
  //         .then(function() {
  //           self.updateUrl()
  //         }, errorLog('Joining room '))
  //     }
  //   }
  // }

  render() {
    let join
    if (this.context.user) {
      join =
        <div id={style.join}>
          <Alert alertType='danger' alert={this.props.alert}/>
          <h4>Write Your Nametag For This Conversation</h4>
          <EditNametag
            nametag={this.props.userNametag}
            roomId={this.props.roomId}/>
          <div id={style.userCertificates}>
            <p className={style.userCertificateText}>
              Click to view your certificates.<br/>
              Drag them over to show them in this conversation.
            </p>
            <UserCertificates/>
          </div>
          <br/>
          <button
            className={style.btnPrimary}>
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
}

Join.contextTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.fund,
}

export default Join
