import { connect } from 'react-redux'
import component from '../../components/Message/Messages'
import {
  watchRoomMessages,
  unWatchRoomMessages,
  postMessage,
  saveMessage,
} from '../../actions/MessageActions'

const mapStateToProps = (state, ownProps) => {
  const messageList = Object.keys(state.messages)
    .filter((m) => state.messages[m].room === ownProps.room)
  return Object.assign({}, {
    messages: state.messages,
    messageList,
    nametags: state.nametags,
  }, ownProps)
}

const mapDispatchToProps = (dispatch) => {
  return {
    watchRoomMessages: (room) => dispatch(watchRoomMessages(room)),
    unWatchRoomMessages: (room) => dispatch(unWatchRoomMessages(room)),
    postMessage: (message) => dispatch(postMessage(message)),
    saveMessage: (id, saved) => dispatch(saveMessage(id, saved)),
  }
}

const Messages = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Messages
