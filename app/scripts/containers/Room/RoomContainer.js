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
  const actions = [
    fetchRooms,
    watchRoom,
    unWatchRoom,
    addRoomMessage,
    watchUserNametags,
    unWatchUserNametags,
    postUpdateUserNametag,
    postMessage,
    addMessage,
    logout,
    setting,
  ]
  return actions.reduce((props, action) => {
    props[action.name] = (...args) => dispatch(action.apply(this, args))
    return props
  }, {})
}

const Room = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Room
