import {compose} from 'react-apollo'
import component from '../../components/User/PasswordReset'
import {passwordReset} from '../../graph/mutations'

const PasswordReset = compose(
  passwordReset
)(component)

export default PasswordReset
