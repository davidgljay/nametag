import { connect } from 'react-redux'
import component from '../../components/Room/Join'
import {providerAuth} from '../../actions/UserActions'
import {joinRoom} from '../../actions/RoomActions'
import {addUserNametagCert, removeUserNametagCert, updateUserNametag} from '../../actions/UserNametagActions'
import {fetchCertificate} from '../../actions/CertificateActions'

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addUserNametagCert(cert, room) {
      return dispatch(addUserNametagCert(cert, room))
    },
    removeUserNametagCert(certId, room) {
      return dispatch(removeUserNametagCert(certId, room))
    },
    updateUserNametag(room, property, value) {
      return dispatch(updateUserNametag(room, property, value))
    },
    providerAuth(provider) {
      return dispatch(providerAuth(provider))
    },
    fetchCertificate(certId) {
      return dispatch(fetchCertificate(certId))
    },
    joinRoom(room, userNametag, userId) {
      return dispatch(joinRoom(room, userNametag, userId))
    },
  }
}

const Join = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Join
