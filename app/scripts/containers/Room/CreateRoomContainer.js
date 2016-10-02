import { connect } from 'react-redux'
import component from '../../components/Room/CreateRoom'
import {addUserNametag} from '../../actions/UserNametagActions'
import {watchNametag, unWatchNametag} from '../../actions/NametagActions'
import {setRoomProp, searchImage, postRoom} from '../../actions/RoomActions'
import {logout} from '../../actions/UserActions'
import {fetchCertificate} from '../../actions/CertificateActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    userNametags: state.userNametags,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addUserNametag(roomId, nametagId) {
      return dispatch(addUserNametag(roomId, nametagId))
    },
    watchNametag(nametagId) {
      return dispatch(watchNametag(nametagId))
    },
    unWatchNametag(nametagId) {
      return dispatch(unWatchNametag(nametagId))
    },
    setRoomProp(room, property, value) {
      return dispatch(setRoomProp(room, property, value))
    },
    searchImage(query, start) {
      return dispatch(searchImage(query, start))
    },
    logout() {
      return dispatch(logout())
    },
    fetchCertificate(certId) {
      return dispatch(fetchCertificate(certId))
    },
    postRoom(room) {
      return dispatch(postRoom(room))
    },
  }
}

const CreateRoom = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default CreateRoom
