import React, {PropTypes, Component} from 'react'
import UserBadges from '../Badge/UserBadges'
import Badges from '../../Badge/Badges'

class GrantBadge extends Component {

  constructor (props) {
    super(props)

    this.state = {
      badges: []
    }
  }

  render () {
    const {} = this.props

    return <div>

     </div>
  }
 }

 const {array, shape, bool, object, string, func} = PropTypes

 GrantBadge.proptypes = {

 }

 export default GrantBadge
