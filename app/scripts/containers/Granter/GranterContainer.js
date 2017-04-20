import component from '../../components/Granter/Granter'
import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {registerUser, loginUser} from '../../actions/UserActions'
import {createBadge, updateBadgeRequestStatus, addNote} from '../../graph/mutations'
import {granterQuery} from '../../graph/queries'

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    registerUser: disp(registerUser),
    loginUser: disp(loginUser)
  }
}

const Granter = compose(
  connect(() => ({}), mapDispatchToProps),
  createBadge,
  addNote,
  updateBadgeRequestStatus,
  granterQuery
)(component)

export default Granter
