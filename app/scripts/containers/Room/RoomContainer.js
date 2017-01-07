import { connect } from 'react-redux'
import component from '../../components/Room/Room'
import {fetchRooms, watchRoom, unWatchRoom, addRoomMessage} from '../../actions/RoomActions'
import {
  watchUserNametags,
  unWatchUserNametags,
  postUpdateUserNametag,
} from '../../actions/UserNametagActions'
import {postMessage, addMessage} from '../../actions/MessageActions'
import {logout, setting} from '../../actions/UserActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    userNametags: state.userNametags,
  }
}
const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    fetchRooms: disp(fetchRooms),
    watchRoom: disp(watchRoom),
    unWatchRoom: disp(unWatchRoom),
    addRoomMessage: disp(addRoomMessage),
    watchUserNametags: disp(watchUserNametags),
    unWatchUserNametags: disp(unWatchUserNametags),
    postUpdateUserNametag: disp(postUpdateUserNametag),
    postMessage: disp(postMessage),
    addMessage: disp(addMessage),
    logout: disp(logout),
    setting: disp(setting),
  }
}

const Room = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Room
