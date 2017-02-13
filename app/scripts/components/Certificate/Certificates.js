import React from 'react'
import Certificate from './Certificate'

const Certificates = ({certificates = []}) =>
  <div id='certificates'>
    {certificates.map((certificate) => {
      return <Certificate
        certificate={certificate}
        key={certificate.id}
        draggable={false} />
    })}
  </div>

export default Certificates
