import React, {PropTypes} from 'react'
import Badge from './Badge'

const Badges = ({badges = [], draggable, removeFromSource, requiredBadges = [], style = {}}) =>
  <div id='badges' style={{...styles.badgesContainer, ...style}}>
    {
      badges && badges.map((badge) => {
        return <Badge
          badge={badge}
          key={badge.id}
          draggable={draggable && requiredBadges.indexOf(badge.id) === -1}
          removeFromSource={removeFromSource} />
      })
    }
  </div>

const {arrayOf, string, shape, bool, func, object} = PropTypes
Badges.propTypes = {
  badges: arrayOf(shape({
    id: string.isRequired
  })),
  requiredBadges: arrayOf(string),
  draggable: bool,
  removeItem: func,
  style: object
}

export default Badges

const styles = {
  badgesContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
}
