import React, {PropTypes, Component} from 'react'
import {grey, primary} from '../../../styles/colors'
import FlatButton from 'material-ui/FlatButton'
import t from '../../utils/i18n'

// TODO: Replace this with a private authorless message to the host.
class HostMessage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      copySuccess: false
    }

    this.onClipboardClick = () => {
      document.querySelector('#shortLink').select()
      try {
        const successful = document.execCommand('copy')
        this.setState({copySuccess: successful})
      } catch (err) {
        console.error('Oops, unable to copy')
      }
    }
  }

  render () {
    const {shortLink} = this.props
    const {copySuccess} = this.state
    return <div style={styles.helpText}>
      <div>{t('message.host_welcome')}</div>
      <div style={styles.copyContainer}>
        <input
          id='shortLink'
          style={styles.copyLink}
          type='text'
          onClick={this.onClipboardClick}
          value={`https://nametag.chat/r/${shortLink}`}
          readOnly />
        <div style={styles.copyButtonContainer}>
          <FlatButton
            style={styles.copyButton}
            label={t('copy_clip')}
            primary
            onClick={this.onClipboardClick}
            />
          {
            copySuccess &&
            <div style={styles.copySuccess}>
              Copied!
            </div>
          }
        </div>
      </div>
    </div>
  }
}

const {string} = PropTypes

HostMessage.proptypes = {
  shortLink: string.isRequired
}

export default HostMessage

const styles = {
  helpText: {
    color: grey,
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 30,
    width: '100%'
  },
  shareText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 3,
    color: grey
  },
  copyLink: {
    padding: 4,
    fontSize: 14,
    margin: '10px 5px 3px 5px',
    width: 200
  },
  copyButton: {
    margin: '0px 5px'
  },
  copyButtonContainer: {
    display: 'flex'
  },
  copySuccess: {
    fontSize: 12,
    flex: 1,
    color: primary,
    textAlign: 'right',
    fontStyle: 'italic',
    margin: 3
  },
  copyContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}
