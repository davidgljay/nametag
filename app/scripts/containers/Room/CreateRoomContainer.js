import { connect } from 'react-redux'
import component from '../../components/Room/CreateRoom'
import {addUserNametag, getUserNametag} from '../../actions/UserNametagActions'
import {watchNametag, unWatchNametag} from '../../actions/NametagActions'
import {setRoomProp, searchImage} from '../../actions/RoomActions'
import {logout} from '../../actions/UserActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    userNametags: state.userNametags,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserNametag(roomId, userId) {
      return dispatch(getUserNametag(roomId, userId))
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
  }
}

const CreateRoom = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default CreateRoom
