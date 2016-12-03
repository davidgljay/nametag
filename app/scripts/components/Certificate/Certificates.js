import React, { Component, PropTypes } from 'react'
import Certificate from './Certificate'

class Certificates extends Component {

  render() {
    let certificates = this.props.certificates || []
    return <div id="certificates">
           {certificates.map(function mapCertificates(certificate) {
             return <Certificate
              certificate={certificate}
              key={certificate.id}
              draggable={false}/>
           })}
        </div>
  }
}

Certificates.propTypes = {
  certificates: PropTypes.array,
}

export default Certificates
