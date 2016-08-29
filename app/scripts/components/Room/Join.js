import React, { Component, PropTypes } from 'react'
import Login  from '../User/Login'
import EditNametag  from '../Nametag/EditNametag'
import UserCertificates  from '../Certificate/UserCertificates'
import Alert  from '../Utils/Alert'
import {joinRoom} from '../../actions/RoomActions'
import style from '../../../styles/RoomCard/Join.css'


class Join extends Component {

  onJoinClick() {
    this.context.dispatch(joinRoom(this.props.room, this.props.userNametag, this.context.user.id))
      .then(() => {
        window.location = '/#/rooms/' + this.props.room
      })
  }

  render() {
    let join
    if (this.context.user && this.context.user.id) {
      join =
        <div id={style.join}>
          <Alert alertType='danger' alert={this.props.alert}/>
          <h4>Write Your Nametag For This Conversation</h4>
          <EditNametag
            userNametag={this.props.userNametag}
            dispatch={this.context.dispatch}
            room={this.props.room}/>
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
            onClick={this.onJoinClick.bind(this)}>
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
  room: PropTypes.string.isRequired,
  normsChecked: PropTypes.bool.isRequired,
  userNametag: PropTypes.object,
}

Join.contextTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Join
