import React from 'react'
import Badge from './Badge'

const Badges = ({badges = []}) =>
  <div id='badges'>
    {badges.map((badge) => {
      return <Badge
        badge={badge}
        key={badge.id}
        draggable={false} />
    })}
  </div>

export default Badges
