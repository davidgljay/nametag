import component from '../../components/Granter/Granter'
import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {createBadge, updateBadgeRequestStatus, addNote, updateToken} from '../../graph/mutations'
import {granterQuery} from '../../graph/queries'
import {requestNotifPermissions} from '../../actions/NotificationActions'

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    requestNotifPermissions: disp(requestNotifPermissions)
  }
}

const Granter = compose(
  connect(() => ({}), mapDispatchToProps),
  createBadge,
  addNote,
  updateBadgeRequestStatus,
  updateToken,
  granterQuery
)(component)

export default Granter
