import { connect } from 'react-redux'
import component from '../../components/Room/Join'
import {providerAuth, appendUserArray} from '../../actions/UserActions'
import {joinRoom} from '../../actions/RoomActions'
import {
  addNametagEditCert,
  removeNametagEditCert,
  updateNametagEdit
} from '../../actions/NametagEditActions'

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNametagEditCert: (cert, room) => dispatch(addNametagEditCert(cert, room)),
    removeNametagEditCert: (certId, room) => dispatch(removeNametagEditCert(certId, room)),
    updateNametagEdit: (room, property, value) =>
      dispatch(updateNametagEdit(room, property, value)),
    providerAuth: (provider) => dispatch(providerAuth(provider)),
    joinRoom: (room, userNametag, userId) => dispatch(joinRoom(room, userNametag, userId)),
    appendUserArray: (property, value) => dispatch(appendUserArray(property, value))
  }
}

const Join = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Join
