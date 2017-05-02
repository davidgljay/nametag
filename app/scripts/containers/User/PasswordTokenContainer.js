import { connect } from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/RoomCards'
import {passwordReset} from '../../graph/mutations'
import {registerUser, loginUser} from '../../actions/UserActions'

const mapStateToProps = (state) => {}

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    registerUser: disp(registerUser),
    loginUser: disp(loginUser)
  }
}

const RoomCards = compose(
  connect(mapStateToProps, mapDispatchToProps),
  passwordReset
)(component)

export default RoomCards
