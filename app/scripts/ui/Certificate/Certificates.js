import React, { Component, PropTypes } from 'react'
import fbase from '../../api/firebase'
import Certificate from './Certificate'

//TODO: Change to Certificates

class Certificates extends Component {

  render() {
    let certificates = this.props.certificates || []
    return <div id="certificates">
           {certificates.map(function mapCertificates(certificate) {
             return <Certificate certificate={certificate} key={certificate.id} draggable={false}/>
           })}
        </div>
  }
}

Certificates.propTypes = {
  certificates: PropTypes.array.isRequired,
}

export default Certificates
