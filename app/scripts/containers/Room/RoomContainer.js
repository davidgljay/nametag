import { connect } from 'react-redux'
import component from '../../components/Room/Room'
import {watchRoom, unWatchRoom, addRoomMessage} from '../../actions/RoomActions'
import {
  getUserNametag,
  updateUserNametag,
  watchNotifications,
  unWatchNotifications,
} from '../../actions/UserNametagActions'
import {postMessage, addMessage} from '../../actions/MessageActions'

const mapStateToProps = (state, props) => {
  let userNametag = state.userNametags[props.params.roomId] ?
  state.userNametags[props.params.roomId].id : null

  return {
    room: state.rooms[props.params.roomId],
    user: state.user,
    userNametag: userNametag,
  }
}
const mapDispatchToProps = (dispatch) => {
  const actions = [
    watchRoom,
    unWatchRoom,
    addRoomMessage,
    getUserNametag,
    updateUserNametag,
    watchNotifications,
    unWatchNotifications,
    postMessage,
    addMessage,
  ]
  return actions.reduce((props, action) => {
    props[action.name] = (...args) => dispatch(action.apply(this, ...args))
  }, {})
}

const Room = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Room
