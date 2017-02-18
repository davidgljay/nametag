import React from 'react'
import Badge from './Badge'

const Badges = ({badges = []}) =>
  <div id='badges'>
    {badges.map((certificate) => {
      return <Badge
        certificate={certificate}
        key={certificate.id}
        draggable={false} />
    })}
  </div>

export default Badges
