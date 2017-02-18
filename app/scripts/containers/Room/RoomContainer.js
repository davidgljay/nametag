import { connect } from 'react-redux'
import component from '../../components/Room/Room'
import {fetchRooms, subscribeToRoom, unsubscribeToRoom, addRoomMessage} from '../../actions/RoomActions'
import {showPresence} from '../../actions/NametagActions'
import {
  watchUserNametags,
  unWatchUserNametags,
  postUpdateUserNametag
} from '../../actions/UserNametagActions'
import {postMessage, saveMessage} from '../../actions/MessageActions'
import {watchDirectMessages, unWatchDirectMessages} from '../../actions/DirectMessageActions'
import {logout, setting} from '../../actions/UserActions'

const mapStateToProps = (state, ownProps) => {
  return {
    rooms: state.rooms,
    user: state.user,
    userNametags: state.userNametags,
    messages: state.messages,
    nametags: state.nametags
  }
}
const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    fetchRooms: disp(fetchRooms),
    subscribeToRoom: disp(subscribeToRoom),
    unsubscribeToRoom: disp(unsubscribeToRoom),
    addRoomMessage: disp(addRoomMessage),
    watchDirectMessages: disp(watchDirectMessages),
    unWatchDirectMessages: disp(unWatchDirectMessages),
    watchUserNametags: disp(watchUserNametags),
    unWatchUserNametags: disp(unWatchUserNametags),
    postUpdateUserNametag: disp(postUpdateUserNametag),
    postMessage: disp(postMessage),
    saveMessage: disp(saveMessage),
    showPresence: disp(showPresence),
    logout: disp(logout),
    setting: disp(setting)
  }
}

const Room = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Room
