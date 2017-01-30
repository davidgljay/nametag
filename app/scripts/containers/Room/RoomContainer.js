import { connect } from 'react-redux'
import component from '../../components/Room/Room'
import {fetchRooms, watchRoom, unWatchRoom, addRoomMessage} from '../../actions/RoomActions'
import {updateNametag, showPresence} from '../../actions/NametagActions'
import {
  watchUserNametags,
  unWatchUserNametags,
  postUpdateUserNametag,
} from '../../actions/UserNametagActions'
import {postMessage, addMessage} from '../../actions/MessageActions'
import {watchDirectMessages, unWatchDirectMessages} from '../../actions/DirectMessageActions'
import {logout, setting} from '../../actions/UserActions'

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms,
    user: state.user,
    userNametags: state.userNametags,
    nametags: state.nametags,
  }
}
const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    fetchRooms: disp(fetchRooms),
    watchRoom: disp(watchRoom),
    unWatchRoom: disp(unWatchRoom),
    addRoomMessage: disp(addRoomMessage),
    watchDirectMessages: disp(watchDirectMessages),
    unWatchDirectMessages: disp(unWatchDirectMessages),
    watchUserNametags: disp(watchUserNametags),
    unWatchUserNametags: disp(unWatchUserNametags),
    postUpdateUserNametag: disp(postUpdateUserNametag),
    postMessage: disp(postMessage),
    showPresence: disp(showPresence),
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
