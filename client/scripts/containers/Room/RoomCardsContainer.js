import { connect } from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/Room/RoomCards'
import {roomsQuery} from '../../graph/queries'
import {passwordResetRequest} from '../../graph/mutations'
import {registerUser, loginUser} from '../../actions/UserActions'

const mapStateToProps = (state) => {
  return {
    nametagEdits: state.nametagEdits
  }
}

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    registerUser: disp(registerUser),
    loginUser: disp(loginUser)
  }
}

const RoomCards = compose(
  connect(mapStateToProps, mapDispatchToProps),
  passwordResetRequest,
  roomsQuery
)(component)

export default RoomCards
