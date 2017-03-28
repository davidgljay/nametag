import component from '../../components/Badge/CreateBadge'
import {compose} from 'react-apollo'
import {createNametag} from '../../graph/mutations'
import {badgeTemplateQuery} from '../../graph/queries'

const CreateBadge = compose(
  createNametag,
  badgeTemplateQuery
)(component)

export default CreateBadge
