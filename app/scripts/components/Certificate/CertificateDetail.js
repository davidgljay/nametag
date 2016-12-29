import React, {Component, PropTypes} from 'react'
import Certificate from './Certificate'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500} from 'material-ui/styles/colors'
import Navbar from '../Utils/Navbar'

class CertificateDetail extends Component {
  static propTypes = {
    certificateId: PropTypes.string.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    setting: PropTypes.func.isRequired,
    certificate: PropTypes.object,
    fetchCertificate: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {fetchCertificate, certificateId} = this.props
    fetchCertificate(certificateId)
  }

  onClaimClick = (user, certificate) => {
    //stuff
  }

  render() {
    const {user, logout, setting, certificate} = this.props
    return <div>
      <Navbar
        user={user}
        logout={logout}
        setting={setting}/>
      <div style={styles.certDetailContainer}>
        <div style={styles.certDetail}>
          <Certificate
            certificate={certificate}
            draggable={false}
            expanded={true}/>
        </div>
        <div style={styles.claimButton}>
          <RaisedButton
            style={styles.button}
            labelStyle={styles.buttonLabel}
            backgroundColor={indigo500}
            onClick={this.onClaimClick(user, certificate)}
            label='CLAIM'/>
        </div>
      </div>
    </div>
  }
}

export default CertificateDetail

const styles =  {
  certDetailContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  certDetail: {
    fontSize: 16,
  },
}
