import component from '../../components/Granter/Granter'
import {compose} from 'react-apollo'
import {createBadge, updateBadgeRequestStatus, addNote} from '../../graph/mutations'
import {granterQuery} from '../../graph/queries'

const Granter = compose(
  createBadge,
  addNote,
  updateBadgeRequestStatus,
  granterQuery
)(component)

export default Granter
