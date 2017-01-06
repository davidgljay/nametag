import { connect } from 'react-redux'
import component from '../../components/Room/Room'
import {watchRoom, unWatchRoom, addRoomMessage} from '../../actions/RoomActions'
import {
  watchUserNametags,
  unWatchUserNametags,
  updateUserNametag,
} from '../../actions/UserNametagActions'
import {postMessage, addMessage} from '../../actions/MessageActions'

const mapStateToProps = (state, props) => {
  return {
    room: state.rooms[props.params.roomId],
    user: state.user,
    userNametag: state.userNametags[props.params.roomId],
  }
}
const mapDispatchToProps = (dispatch) => {
  const actions = [
    watchRoom,
    unWatchRoom,
    addRoomMessage,
    watchUserNametags,
    unWatchUserNametags,
    updateUserNametag,
    postMessage,
    addMessage,
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
