import React, {Component, PropTypes} from 'react'
import Badge from './Badge'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {indigo500} from 'material-ui/styles/colors'
import Navbar from '../Utils/Navbar'
import Login from '../User/Login'
import QRcode from 'qrcode.react'

class BadgeDetail extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showQR: false
    }

    this.onClaimClick = (certificateId) => () => {
      const {appendUserArray, grantBadge} = this.props
      appendUserArray('badges', certificateId)
        .then(() => {
          return grantBadge(certificateId)
        })
    }

    this.onEmailClick = () => {
      const path = window.location.href
      window.open = (`mailto:?&subject=${encodeURIComponent('You\'ve been granted a certificate on Nametag!')}` +
               `&body=${encodeURIComponent(`To claim your certificate just visit this URL.\n\n${path}`)}`, '_blank').focus()
    }

    this.onClipboardClick = () => {
      document.querySelector('#hiddenPath').select()
      try {
        const successful = document.execCommand('copy')
        this.setState({copySuccess: successful})
      } catch (err) {
        console.error('Oops, unable to copy')
      }
    }

    this.onQRClick = () => {
      this.setState({showQR: !this.state.showQR})
    }

    this.onHomeClick = () => {
      window.location = '/rooms'
    }
  }

  componentDidMount () {
    const {fetchBadge, certificateId} = this.props
    fetchBadge(certificateId)
  }

  render () {
    const {user, logout, setting, certificate, providerAuth} = this.props

    let headerText
    let claimButton

    if (!certificate) {
      return null
    }

    if (certificate.granted) {
      headerText = <div style={styles.header}>
        <h3>This certificate has been claimed.</h3>
      </div>
    } else {
      headerText = certificate.creator === user.id
      ? <div>
        <div style={styles.header}>
          <h3>Your certificate has been created.</h3>
          It can be claimed by the first person to visit this URL, please
          securly share it with the intended recipient of this certificate.
        </div>
        <input
          type='text'
          style={styles.hiddenPath}
          id='hiddenPath'
          value={window.location.href} />
        <div style={styles.shareButtons}>
          <FlatButton
            style={styles.button}
            onClick={this.onEmailClick}
            label='E-MAIL' />
          <FlatButton
            style={styles.button}
            onClick={this.onClipboardClick}
            label='COPY TO CLIPBOARD' />
          <FlatButton
            style={styles.button}
            onClick={this.onQRClick}
            label='SHOW QR CODE' />
        </div>
      </div>
        : <div style={styles.header}>
          <h3>You have been granted a certificate!</h3>
          Claim it so that you can show it off! Badges
          let others know why you are worthy of trust and respect.
          They can also give you access to exclusive communities.
        </div>
    }

    if (certificate.granted) {
      claimButton = <div style={styles.claimButton}>
        <RaisedButton
          style={styles.button}
          labelStyle={styles.buttonLabel}
          backgroundColor={indigo500}
          label='BACK TO HOMEPAGE'
          onClick={this.onHomeClick} />
      </div>
    } else if (!user || !user.id) {
      claimButton = <Login message={'Log in to claim'} providerAuth={providerAuth} />
    } else if (certificate.creator !== user.id) {
      claimButton = <div style={styles.claimButton}>
        <RaisedButton
          style={styles.button}
          labelStyle={styles.buttonLabel}
          backgroundColor={indigo500}
          onClick={this.onClaimClick(certificate.id)}
          label='CLAIM THIS CERTIFICATE' />
      </div>
    }

    return <div>
      <Navbar
        user={user}
        logout={logout}
        setting={setting} />
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
          <div style={styles.QRcode}>
            <QRcode value={window.location.href} size={256} />
          </div>
        }
        <div style={styles.certDetail}>
          <Badge
            certificate={certificate}
            draggable={false}
            expanded />
        </div>
        {claimButton}
      </div>
    </div>
  }
}

BadgeDetail.propTypes = {
  certificateId: PropTypes.string.isRequired,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  setting: PropTypes.func.isRequired,
  certificate: PropTypes.object,
  fetchBadge: PropTypes.func.isRequired,
  appendUserArray: PropTypes.func.isRequired,
  grantBadge: PropTypes.func.isRequired
}

export default BadgeDetail

const styles = {
  header: {
    textAlign: 'center',
    maxWidth: 450
  },
  certDetailContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  certDetail: {
    fontSize: 16,
    lineHeight: '20px',
    maxWidth: 350
  },
  claimButton: {
    margin: 30
  },
  buttonLabel: {
    color: '#fff'
  },
  shareButtons: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  hiddenPath: {
    color: 'white',
    border: 'none',
    width: 1,
    height: 1,
    outline: 'none'
  },
  QRcode: {
    margin: 20
  },
  copySuccess: {
    color: 'green',
    fontSize: 12
  }
}
