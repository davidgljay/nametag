import component from '../../components/Badge/CreateBadge'
import {compose} from 'react-apollo'
import {createTemplate} from '../../graph/mutations'
import {createTemplateQuery} from '../../graph/queries'

const CreateBadge = compose(
  createTemplate,
  createTemplateQuery
)(component)

export default CreateBadge
