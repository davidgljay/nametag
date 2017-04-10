import component from '../../components/Granter/Granter'
import {compose} from 'react-apollo'
import {createBadge, updateBadgeRequestStatus} from '../../graph/mutations'
import {granterQuery} from '../../graph/queries'

const Granter = compose(
  createBadge,
  updateBadgeRequestStatus,
  granterQuery
)(component)

export default Granter
