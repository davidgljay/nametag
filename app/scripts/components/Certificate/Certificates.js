import React from 'react'
import Badge from './Badge'

const Badges = ({certificates = []}) =>
  <div id='certificates'>
    {certificates.map((certificate) => {
      return <Badge
        certificate={certificate}
        key={certificate.id}
        draggable={false} />
    })}
  </div>

export default Badges
