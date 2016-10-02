import React, { Component, PropTypes } from 'react'
import errorLog from '../../utils/errorLog'
import Certificate from '../../containers/Certificate/CertificateContainer'
import {fetch} from '../../actions/CertificateActions'


class UserCertificates extends Component {

  componentDidMount() {
    if (!this.context.user ||
      !this.context.user.data ||
      !this.context.user.data.certificates) {
      return
    }
    let certificates = this.context.user.data.certificates
    for (let i = 0; i < certificates.length; i++) {
      this.props.fetchCertificates(certificates[i])
    }
  }


  render() {
    return <div id="certificates">
          {
            this.context.user &&
            this.context.user.data &&
            this.context.user.data.certificates &&
            this.context.user.data.certificates
            .filter((certificateId) => {
              if (!this.props.selectedCerts) {
                return true
              }
              let selected = false
              this.props.selectedCerts.reduce((prev, cert) => {
                if (cert.id === certificateId) {
                  selected = true
                }
              }, {})
              return !selected
            })
            .map((certificateId) => {
              return <Certificate
                id={certificateId}
                key={certificateId}
                draggable={true}/>
            })
          }
        </div>
  }
}

UserCertificates.contextTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
}

export default UserCertificates
