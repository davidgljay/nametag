import { connect } from 'react-redux'
import component from '../../components/Message/Messages'
import {
  watchRoomMessages,
  unWatchRoomMessages,
  postMessage,
} from '../../actions/MessageActions'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, {
    messages: state.messages,
    messageList: state.rooms[ownProps.room].messages,
    nametags: state.nametags,
  }, ownProps)
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchRoomMessages(room) {
      dispatch(watchRoomMessages(room))
    },
    unWatchRoomMessages(room) {
      dispatch(unWatchRoomMessages(room))
    },
    postMessage(message) {
      dispatch(postMessage(message))
    },
  }
}

const Messages = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Messages
