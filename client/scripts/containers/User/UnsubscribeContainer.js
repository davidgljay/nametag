import {compose} from 'react-apollo'
import component from '../../components/User/Unsubscribe'
import {unsubscribe} from '../../graph/mutations'

const Unsubscribe = compose(
  unsubscribe
)(component)

export default Unsubscribe
