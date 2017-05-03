import { connect } from 'react-redux'
import {compose} from 'react-apollo'
import component from '../../components/User/PasswordReset'
import {passwordReset} from '../../graph/mutations'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

const RoomCards = compose(
  connect(mapStateToProps, mapDispatchToProps),
  passwordReset
)(component)

export default RoomCards
