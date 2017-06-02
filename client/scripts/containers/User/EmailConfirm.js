import {compose} from 'react-apollo'
import component from '../../components/User/EmailConfirm'
import {emailConfirmation} from '../../graph/mutations'

const EmailConfirm = compose(
  emailConfirmation
)(component)

export default EmailConfirm
