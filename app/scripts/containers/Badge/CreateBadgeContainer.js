import {connect} from 'react-redux'
import component from '../../components/Badge/CreateBadge'
import {compose} from 'react-apollo'
import {createBadgeTemplate} from '../../graph/mutations'
import {userQuery} from '../../graph/queries'

const CreateBadge = compose(
  connect((state, {params}) => ({granter: params.granterId})),
  createBadgeTemplate,
  userQuery
)(component)

export default CreateBadge
