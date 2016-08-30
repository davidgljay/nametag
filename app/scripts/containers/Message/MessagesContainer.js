import { connect } from 'react-redux'
import component from '../../components/Message/Messages'

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, {
    messages: state.messages,
    messageList: state.rooms[ownProps.room].messages,
  }, ownProps)
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  }
}

const Messages = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Messages
