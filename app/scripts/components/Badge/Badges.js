import React, {PropTypes} from 'react'
import Badge from './Badge'

const Badges = ({badges = [], draggable, removeFromSource}) =>
  <div id='badges' style={styles.badgesContainer}>
    {badges.map((badge) => {
      return <Badge
        badge={badge}
        key={badge.id}
        draggable={draggable}
        removeFromSource={removeFromSource} />
    })}
  </div>

const {arrayOf, string, shape, bool, func} = PropTypes
Badges.propTypes = {
  badges: arrayOf(shape({
    id: string.isRequired
  })).isRequired,
  draggable: bool,
  removeItem: func
}

export default Badges

const styles = {
  badgesContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}
