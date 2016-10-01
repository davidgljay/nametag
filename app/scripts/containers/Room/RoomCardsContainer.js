import { connect } from 'react-redux'
import component from '../../components/Room/RoomCards'
import {addUserNametag, getUserNametag} from '../../actions/UserNametagActions'
import {watchNametag, unWatchNametag} from '../../actions/NametagActions'
import {logout} from '../../actions/UserActions'
import {subscribe, unsubscribe, setRoomProp, searchImage} from '../../actions/RoomActions'
import {addUserNametagCert, removeUserNametagCert, updateUserNametag} from '../../actions/UserNametagActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    nametags: state.nametags,
    user: state.user,
    userNametags: state.userNametags,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserNametag(roomId, userId) {
      return dispatch(getUserNametag(roomId, userId))
    },
    subscribe(roomId) {
      return dispatch(subscribe(roomId))
    },
    unsubscribe(roomId) {
      return dispatch(unsubscribe(roomId))
    },
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
    addUserNametagCert(cert, room) {
      return dispatch(addUserNametag(cert, room))
    },
    removeUserNametagCert(certId, room) {
      return dispatch(removeUserNametagCert(certId, room))
    },
    updateUserNametag(room, property, value) {
      return dispatch(updateUserNametag(room, property, value))
    },
  }
}

const RoomCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default RoomCards
