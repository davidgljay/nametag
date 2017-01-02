import React, {Component, PropTypes} from 'react'
import Certificate from './Certificate'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {indigo500} from 'material-ui/styles/colors'
import Navbar from '../Utils/Navbar'
import QRcode from 'qrcode.react'

class CertificateDetail extends Component {
  static propTypes = {
    certificateId: PropTypes.string.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    setting: PropTypes.func.isRequired,
    certificate: PropTypes.object,
    fetchCertificate: PropTypes.func.isRequired,
    appendUserArray: PropTypes.func.isRequired,
    grantCertificate: PropTypes.func.isRequired,
  }

  state = {
    showQR: false,
  }

  componentDidMount() {
    const {fetchCertificate, certificateId} = this.props
    fetchCertificate(certificateId)
  }

  onClaimClick = (certificateId) => () => {
    const {appendUserArray, grantCertificate} = this.props
    appendUserArray('certificates', certificateId)
      .then(() => {
        return grantCertificate(certificateId)
      })
  }

  onEmailClick = () => {
    const path = window.location.href
    window.location = 'mailto:?'
             + '&subject='
             + encodeURIComponent('You\'ve been granted a certificate on Nametag!')
             + '&body='
             + encodeURIComponent(`To claim your certificate just visit this URL.\n\n${path}`)
  }

  onClipboardClick = () => {
    document.querySelector('#hiddenPath').select()
    try {
      const successful = document.execCommand('copy')
      this.setState({copySuccess: successful})
    } catch (err) {
      console.error('Oops, unable to copy')
    }
  }

  onQRClick = () => {
    this.setState({showQR: !this.state.showQR})
  }

  render() {
    const {user, logout, setting, certificate} = this.props

    let headerText
    if (certificate) {
      if (certificate.granted) {
        headerText = <div style={styles.header}>
          <h3>This certificate has been claimed.</h3>
        </div>
      } else {
        headerText = certificate.creator === user.id ?
        <div>
          <div style={styles.header}>
            <h3>Your certificate has been created.</h3>
            It can be claimed by the first person to visit this URL, please
            securly share it with the intended recipient of this certificate.
          </div>
          <input
            type='text'
            style={styles.hiddenPath}
            id='hiddenPath'
            value={window.location.href}/>
          <div style={styles.shareButtons}>
            <FlatButton
              style={styles.button}
              onClick={this.onEmailClick}
              label='E-MAIL'/>
            <FlatButton
              style={styles.button}
              onClick={this.onClipboardClick}
              label='COPY TO CLIPBOARD'/>
            <FlatButton
              style={styles.button}
              onClick={this.onQRClick}
              label='SHOW QR CODE'/>
            </div>
          </div>
          : <div style={styles.header}>
            <h3>You have been granted the following certificate.</h3>
          </div>
      }
    }

    return <div>
      <Navbar
        user={user}
        logout={logout}
        setting={setting}/>
      <div style={styles.certDetailContainer}>
        {
          headerText
        }
        {
          this.state.copySuccess &&
          <div style={styles.copySuccess}>
            Copied!
          </div>
        }
        {
          this.state.showQR &&
          <QRcode value={window.location.href} size={256} style={styles.QRcode}/>
        }
        <div style={styles.certDetail}>
          <Certificate
            certificate={certificate}
            draggable={false}
            expanded={true}/>
        </div>
        {
          certificate &&
          !certificate.granted &&
          certificate.creator !== user.id &&
          <div style={styles.claimButton}>
            <RaisedButton
              style={styles.button}
              labelStyle={styles.buttonLabel}
              backgroundColor={indigo500}
              onClick={this.onClaimClick(certificate.id)}
              label='CLAIM THIS CERTIFICATE'/>
          </div>
        }
      </div>
    </div>
  }
}

export default CertificateDetail

const styles =  {
  header: {
    width: 450,
    textAlign: 'center',
  },
  certDetailContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  certDetail: {
    fontSize: 16,
    lineHeight: '20px',
  },
  claimButton: {
    margin: 30,
  },
  buttonLabel: {
    color: '#fff',
  },
  shareButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  hiddenPath: {
    color: 'white',
    border: 'none',
    width: 1,
    height: 1,
    outline: 'none',
  },
  QRcode: {
    margin: 20,
  },
  copySuccess: {
    color: 'green',
    fontSize: 12,
  },
}
