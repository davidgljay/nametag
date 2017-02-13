import React, { Component, PropTypes } from 'react'
import Certificate from '../../containers/Certificate/CertificateContainer'
import CreateCertificate from '../../containers/Certificate/CreateCertificateContainer'
import FlatButton from 'material-ui/FlatButton'
import {grey500} from 'material-ui/styles/colors'

class UserCertificates extends Component {

  constructor (props) {
    super(props)

    this.contextTypes = {
      user: PropTypes.object,
      dispatch: PropTypes.func
    }

    this.state = {
      showCreateCert: false
    }

    this.onCreateCertClick = () => {
      this.setState({showCreateCert: !this.state.showCreateCert})
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
    return <div id='certificates' style={styles.container}>
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
              return <div key={certificateId}>
                <Certificate
                  id={certificateId}
                  draggable />
              </div>
            })
          }
      {
            this.context.user &&
            this.context.user.data &&
            this.context.user.data.certificates &&
            this.context.user.data.certificates.length === 0 &&
            <div style={styles.noCerts}>
              You do not currently have any badges, want to add some?
            </div>
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

const styles = {
  noCerts: {
    color: grey500
  },
  container: {
    width: '100%'
  }
}
