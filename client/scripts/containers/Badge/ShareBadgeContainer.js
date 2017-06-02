import component from '../../components/Badge/ShareBadge'
import {compose} from 'react-apollo'
import {templateQuery} from '../../graph/queries'

const CreateBadge = compose(
  templateQuery
)(component)

export default CreateBadge
