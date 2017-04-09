import component from '../../components/Badge/CreateBadge'
import {compose} from 'react-apollo'
import {createBadge, updateBadgeRequest} from '../../graph/mutations'
import {granterQuery} from '../../graph/queries'

const Granter = compose(
  createBadge,
  updateBadgeRequest,
  granterQuery
)(component)

export default Granter
