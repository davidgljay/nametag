import { connect } from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/ApproveRoom'
import {userQuery} from '../../graph/queries'
import {approveRoom} from '../../graph/mutations'
import {registerUser, loginUser, passwordResetRequest} from '../../actions/UserActions'

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    registerUser: disp(registerUser),
    loginUser: disp(loginUser),
    passwordResetRequest: disp(passwordResetRequest)
  }
}

const ApproveRoom = compose(
  connect(() => {}, mapDispatchToProps),
  approveRoom,
  userQuery
)(component)

export default ApproveRoom
