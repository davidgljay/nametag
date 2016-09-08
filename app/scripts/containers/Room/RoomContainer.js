import { connect } from 'react-redux'
import component from '../../components/Room/Room'
import {watchRoom, unWatchRoom} from '../../actions/RoomActions'
import {getUserNametag} from '../../actions/UserActions'
import {postMessage} from '../../actions/MessageActions'

const mapStateToProps = (state, props) => {
  let userNametag = state.user.nametags ? state.user.nametags[props.params.roomId] : null
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
  }
}

const Room = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Room
