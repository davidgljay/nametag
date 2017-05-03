import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {passwordResetRequest} from '../../graph/mutations'
import {registerUser, loginUser} from '../../actions/UserActions'
import component from '../../components/User/Login'

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    registerUser: disp(registerUser),
    loginUser: disp(loginUser)
  }
}

const Login = compose(
  connect(props => props, mapDispatchToProps),
  passwordResetRequest
)(component)

export default Login
