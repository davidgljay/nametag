import React, {PropTypes} from 'react'
import Badges from '../Badge/Badges'

const GrantBadge = ({grantableTemplates, badgeGrantee, setBadgeToGrant, setRecipient, setBadgeGrantee}) => {
  const grantableBadges = grantableTemplates.map(template => ({
    id: template.id,
    template
  }))

  const onBadgeClick = badgeId => {
    setBadgeToGrant(badgeId)
    setRecipient(badgeGrantee)
    setBadgeGrantee('')
  }

  return <div style={styles.container}>
    <h3>Which badge would you like to grant?</h3>
    <Badges
      badges={grantableBadges}
      onBadgeClick={onBadgeClick} />
  </div>
}

const {arrayOf, object, func, string} = PropTypes

GrantBadge.proptypes = {
  grantableTemplates: arrayOf(object),
  badgeGrantee: string.isRequired,
  setRecipient: func.isRequired,
  setBadgeGrantee: func.isRequired,
  setBadgeToGrant: func.isRequired
}

export default GrantBadge

const styles = {
  container: {
    padding: 20,
    borderRadius: 4
  }
}
