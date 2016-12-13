import React, { Component, PropTypes } from 'react'
import Login  from '../User/Login'
import EditNametag  from '../Nametag/EditNametag'
import UserCertificates  from '../Certificate/UserCertificates'
import {grey400, indigo500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'

const styles = {
  join: {
    textAlign: 'center',
  },
  userCertificates: {
    width: 240,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    justifyContent: 'center',
    padding: 5,
    margin: 5,
  },
  userCertificateText: {
    fontStyle: 'italic',
    fontSize: 16,
    color: grey400,
  },
  userCertificateIcon: {
    color: grey400,
    fontSize: 18,
    verticalAlign: 'middle',
  },
  button: {
    color: '#fff',
    fontWeight: 'bold',
  },
}

class Join extends Component {

  static propTypes = {
    room: PropTypes.string.isRequired,
    normsChecked: PropTypes.bool.isRequired,
    userNametag: PropTypes.object,
    addUserNametagCert: PropTypes.func.isRequired,
    removeUserNametagCert: PropTypes.func.isRequired,
    updateUserNametag: PropTypes.func.isRequired,
    providerAuth: PropTypes.func.isRequired,
    fetchCertificate: PropTypes.func.isRequired,
    joinRoom: PropTypes.func.isRequired,
  }

  static contextTypes = {
    user: PropTypes.object,
  }

  onJoinClick() {
    // TODO: Add new user name to displayNames list.
    this.props.joinRoom(this.props.room, this.props.userNametag, this.context.user.id)
      .then(() => {
        window.location = `/rooms/${this.props.room}`
      })
  }

  render() {
    let join
    if (this.context.user.id) {
      join =
        <div style={styles.join}>
          <h4>Edit Your Nametag For This Conversation</h4>
          <EditNametag
            userNametag={this.props.userNametag}
            userDefaults={this.context.user.data}
            appendUserArray={this.props.appendUserArray}
            addUserNametagCert={this.props.addUserNametagCert}
            removeUserNametagCert={this.props.removeUserNametagCert}
            updateUserNametag={this.props.updateUserNametag}
            room={this.props.room}/>
          <div style={styles.userCertificates}>
            <p style={styles.userCertificateText}>
              <FontIcon
                style={styles.userCertificateIcon}
                className="material-icons">arrow_upward</FontIcon>
              Drag to Share
              <FontIcon
                style={styles.userCertificateIcon}
                className="material-icons">arrow_upward</FontIcon>
            </p>
            <UserCertificates
              fetchCertificate={this.props.fetchCertificate}
              selectedCerts={this.props.userNametag.certificates}/>
          </div>
          <br/>
          <RaisedButton
            backgroundColor={indigo500}
            labelStyle={styles.button}
            onClick={this.onJoinClick.bind(this)}
            label='JOIN'/>
        </div>
    } else {
      join = <Login providerAuth={this.props.providerAuth}/>
    }
    return join
  }
}

export default Join
