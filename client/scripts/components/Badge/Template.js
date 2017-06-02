import React, {PropTypes, Component} from 'react'
import Badge from './Badge'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import DefaultNametag from './BadgeDefaultNametag'
import FontIcon from 'material-ui/FontIcon'
import {grey, primary} from '../../../styles/colors'

class Template extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showLink: false,
      copySuccess: false
    }

    this.onClipboardClick = () => {
      document.querySelector('#shareLink').select()
      try {
        const successful = document.execCommand('copy')
        this.setState({copySuccess: successful})
      } catch (err) {
        console.error('Oops, unable to copy')
      }
    }

    this.onMailClick = () => {
      window.open(
        `mailto:?&subject=${encodeURIComponent(`You've been granted a ${this.props.template.name} badge on Nametag!`)}` +
       `&body=${encodeURIComponent(`To claim your certificate just visit this URL:\n\n${this.getPath()}`)}`, '_blank'
     )
    }

    this.getPath = () => `https://${window.location.host}/badges/${this.props.template.id}`
  }

  render () {
    const {template, addNote} = this.props
    const {showLink, copySuccess} = this.state
    return <div key={template.id}>
      <div style={styles.template}>
        <Badge
          jumbo
          badge={{
            template,
            id: 'template'
          }} />
        <div style={styles.shareContainer}>
          <div style={styles.shareOptions}>
            <div style={styles.shareText}>
              GRANT WITH:
            </div>
            <IconButton
              style={styles.imageButton}
              iconStyle={styles.shareIcon}
              onTouchTap={() => this.setState({showLink: !showLink})}>
              <FontIcon
                className='material-icons'>
                link
              </FontIcon>
            </IconButton>
            <IconButton
              style={styles.imageButton}
              iconStyle={styles.shareIcon}
              onTouchTap={() => { window.location = `/badges/${template.id}/qrcode` }}>
              <FontIcon
                className='fa fa-qrcode' />
            </IconButton>
            <IconButton
              style={styles.imageButton}
              iconStyle={styles.shareIcon}
              onTouchTap={this.onMailClick}>
              <FontIcon
                className='material-icons'>
                email
              </FontIcon>
            </IconButton>
          </div>
        </div>
      </div>
      {
        showLink &&
        <div>
          <input
            id='shareLink'
            style={styles.copyLink}
            type='text'
            onClick={this.onClipboardClick}
            value={this.getPath()}
            readOnly />
          <div style={styles.copyButtonContainer}>
            <FlatButton
              style={styles.copyButton}
              label='COPY TO CLIPBOARD'
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
      }
      <div style={styles.nametagsContainer}>
        {
          template.badges.map(({id, defaultNametag, notes}) =>
            <DefaultNametag
              key={id}
              id={id}
              addNote={addNote}
              defaultNametag={defaultNametag}
              notes={notes} />
          )
        }
      </div>
    </div>
  }
}

const {shape, string, object, arrayOf, func} = PropTypes

Template.propTypes = {
  template: shape({
    id: string.isRequired,
    name: string.isRequired,
    image: string.isRequired,
    description: string.isRequired,
    badges: arrayOf(shape({
      id: string.isRequired,
      notes: arrayOf(shape({
        text: string.isRequired,
        date: string.isRequired
      })).isRequired,
      defaultNametag: object.isRequired
    })).isRequired
  }).isRequired,
  addNote: func.isRequired
}

export default Template

const styles = {
  template: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 20
  },
  headerText: {
    fontSize: 14,
    color: grey,
    fontStyle: 'italic',
    margin: '0px 10px'
  },
  nametagsContainer: {
    margin: 10,
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  imageButton: {
    width: 'inherit',
    height: 'inherit',
    padding: 0,
    margin: '3px 5px'
  },
  shareIcon: {
    fontSize: 22,
    color: grey
  },
  shareContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  shareOptions: {
    display: 'flex'
  },
  shareText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 3,
    color: grey
  },
  copyLink: {
    width: '80%',
    padding: 4,
    fontSize: 14,
    margin: '10px 5px 3px 5px'
  },
  copyButton: {
    margin: '0px 5px'
  },
  copyButtonContainer: {
    display: 'flex',
    width: '80%'
  },
  copySuccess: {
    fontSize: 12,
    flex: 1,
    color: primary,
    textAlign: 'right',
    fontStyle: 'italic',
    margin: 3
  }
}
