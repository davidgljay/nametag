import {compose} from 'react-apollo'
import component from '../../components/Granter/Embed'
import {embedQuery} from '../../graph/queries'

const Embed = compose(
  embedQuery
)(component)

export default Embed
