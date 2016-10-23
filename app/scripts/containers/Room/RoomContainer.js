import { connect } from 'react-redux'
import component from '../../components/Room/Room'
import {watchRoom, unWatchRoom, addRoomMessage} from '../../actions/RoomActions'
import {getUserNametag} from '../../actions/UserNametagActions'
import {postMessage, addMessage} from '../../actions/MessageActions'

const mapStateToProps = (state, props) => {
  let userNametag = state.userNametags[props.params.roomId] ? state.userNametags[props.params.roomId].id : null
  return {
    room: state.rooms[props.params.roomId],
    user: state.user,
    userNametag: userNametag,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    watchRoom(room) {
      dispatch(watchRoom(room))
    },
    unWatchRoom(room) {
      dispatch(unWatchRoom(room))
    },
    getUserNametag(room, user) {
      dispatch(getUserNametag(room, user))
    },
    postMessage(message) {
      dispatch(postMessage(message))
    },
    addRoomMessage(room, messageId) {
      dispatch(addRoomMessage(room, messageId))
    },
    addMessage(message, id) {
      dispatch(addMessage(message, id))
    },
  }
}

const Room = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Room
