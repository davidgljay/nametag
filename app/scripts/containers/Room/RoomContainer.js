import {connect} from 'react-redux'
import component from '../../components/Room/Room'
import {compose} from 'react-apollo'
import {roomQuery} from '../../graph/queries'
import {createMessage, toggleSaved, updateLatestVisit, updateToken} from '../../graph/mutations'
import {requestNotifPermissions} from '../../actions/NotificationActions'

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    requestNotifPermissions: disp(requestNotifPermissions)
  }
}

const Room = compose(
  connect(() => {}, mapDispatchToProps),
  createMessage,
  toggleSaved,
  updateLatestVisit,
  updateToken,
  roomQuery
)(component)

export default Room
