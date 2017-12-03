import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {registerUser} from '../../actions/UserActions'
import component from '../../components/User/Login'

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    registerUser: disp(registerUser)
  }
}

const Login = compose(
  connect(props => props, mapDispatchToProps)
)(component)

export default Login
