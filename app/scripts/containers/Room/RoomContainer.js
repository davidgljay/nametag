import {connect} from 'react-redux'
import component from '../../components/Room/Room'
import {compose} from 'react-apollo'
import {roomQuery} from '../../graph/queries'
import {createMessage, toggleSaved, updateLatestVisit} from '../../graph/mutations'
import {requestNotifPermissions} from '../../actions/NotificationActions'

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
    requestNotifPermissions: disp(requestNotifPermissions)
  }
}

const Room = compose(
  connect(mapStateToProps, mapDispatchToProps),
  createMessage,
  toggleSaved,
  updateLatestVisit,
  roomQuery
)(component)

export default Room
