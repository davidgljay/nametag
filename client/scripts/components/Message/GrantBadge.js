import React, {PropTypes} from 'react'
import Badges from '../Badge/Badges'

const GrantBadge = ({grantableTemplates, selectBadge}) => {
  const grantableBadges = grantableTemplates.map(template => ({
    id: template.id,
    template
  }))

  return <div>
    <Badges
      badges={grantableBadges}
      selectBadge={selectBadge} />
  </div>
}

const {arrayOf, object, func} = PropTypes

GrantBadge.proptypes = {
  grantableTemplates: arrayOf(object),
  selectBadge: func.isRequired
}

export default GrantBadge
