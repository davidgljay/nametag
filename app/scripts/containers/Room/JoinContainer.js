import { connect } from 'react-redux'
import component from '../../components/Room/Join'
import {providerAuth, appendUserArray} from '../../actions/UserActions'
import {joinRoom} from '../../actions/RoomActions'
import {
  addUserNametagCert,
  removeUserNametagCert,
  updateUserNametag
} from '../../actions/UserNametagActions'
import {fetchCertificate} from '../../actions/CertificateActions'

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addUserNametagCert: (cert, room) => dispatch(addUserNametagCert(cert, room)),
    removeUserNametagCert: (certId, room) => dispatch(removeUserNametagCert(certId, room)),
    updateUserNametag: (room, property, value) =>
      dispatch(updateUserNametag(room, property, value)),
    providerAuth: (provider)  => dispatch(providerAuth(provider)),
    fetchCertificate: (certId) => dispatch(fetchCertificate(certId)),
    joinRoom: (room, userNametag, userId) => dispatch(joinRoom(room, userNametag, userId)),
    appendUserArray: (property, value) => dispatch(appendUserArray(property, value)),
  }
}

const Join = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Join
