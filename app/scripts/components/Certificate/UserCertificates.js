import React, { Component, PropTypes } from 'react'
import Certificate from '../../containers/Certificate/CertificateContainer'
import CreateCertificate from '../../containers/Certificate/CreateCertificateContainer'
import FlatButton from 'material-ui/FlatButton'
import {grey500} from 'material-ui/styles/colors'

class UserCertificates extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showCreateCert: false
    }

    this.onCreateCertClick = () => {
      this.setState({showCreateCert: !this.state.showCreateCert})
    }

    this.mapCertificates = (certificates) => {
      if (certificates.length === 0) {
        return <div style={styles.noCerts}>
          You do not currently have any badges, want to add some?
        </div>
      }
      return certificates
        .filter((certificateId) => {
          if (!this.props.selectedCerts) {
            return true
          }
          this.props.selectedCerts.map((cert) => {
            if (cert.id === certificateId) {
              return false
            }
          })
          return true
        })
        .map((certificateId) =>
          <div key={certificateId}>
            <Certificate
              id={certificateId}
              draggable />
          </div>)
    }
  }

  componentDidMount () {
    if (!this.context.user ||
      !this.context.user.data ||
      !this.context.user.data.certificates) {
      return
    }
    let certificates = this.context.user.data.certificates
    for (let i = 0; i < certificates.length; i++) {
      this.props.fetchCertificate(certificates[i])
    }
  }

  render () {
    if (!this.context.user ||
      !this.context.user.data ||
      !this.context.user.data.certificates) {
      return
    }
    return <div id='certificates' style={styles.container}>
      {
        this.mapCertificates(this.context.user.data.certificates)
      }
      <FlatButton
        label='ADD BADGE'
        onClick={this.onCreateCertClick} />
      {
            this.state.showCreateCert &&
            <CreateCertificate
              mini
              toggleCreateCert={this.onCreateCertClick} />
          }
    </div>
  }
}

export default UserCertificates

UserCertificates.contextTypes = {
  user: PropTypes.object
}

const styles = {
  noCerts: {
    color: grey500
  },
  container: {
    width: '100%'
  }
}
