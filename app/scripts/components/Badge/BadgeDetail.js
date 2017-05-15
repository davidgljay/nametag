import React, {Component, PropTypes} from 'react'
import Badge from './Badge'
import RaisedButton from 'material-ui/RaisedButton'
import EditNametag from '../Nametag/EditNametag'
import CircularProgress from 'material-ui/CircularProgress'
import NavBar from '../Utils/NavBar'
import UserBadges from './UserBadges'
import Login from '../../containers/User/LoginContainer'

class BadgeDetail extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showQR: false,
      requested: false
    }

    this.onRequestClick = () => {
      const {nametagEdits, createNametag, data: {template: {id}}} = this.props
      createNametag(nametagEdits[id])
        .then(() => this.setState({requested: true}))
      // TODO: Send to homepage with message, possibly via Router.link?
    }

    this.onEmailClick = () => {
      const path = `https://${window.location.host}/badges/${this.props.template.id}`
      window.open = (`mailto:?&subject=${encodeURIComponent('You\'ve been granted a certificate on Nametag!')}` +
               `&body=${encodeURIComponent(`To claim your certificate just visit this URL.\n\n${path}`)}`, '_blank').focus()
    }

    this.onClipboardClick = () => {
      document.querySelector('#hiddenPath').select()
      try {
        const successful = document.execCommand('copy')
        this.setState({copySuccess: successful})
      } catch (err) {
        // TODO: Display error in this case
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
    const {requestNotifPermissions, updateToken} = this.props
    requestNotifPermissions(updateToken)
  }

  render () {
    const {
      data: {me, template, loading},
      nametagEdits,
      updateNametagEdit,
      addNametagEditBadge,
      removeNametagEditBadge
    } = this.props

    if (loading) {
      return <div style={styles.spinner}>
        <CircularProgress />
      </div>
    }

    let claimButton
    const nametag = nametagEdits[template.id]

    if (!me) {
      claimButton = <Login
        message='Log in to request this badge' />
    } else if (this.state.requested) {
      claimButton = <div style={styles.claimButton}>
        <div style={styles.header}>
          <h3>Request submitted</h3>
          You should hear back from {template.granter.name} shortly.
          <RaisedButton
            style={styles.claimButton}
            labelStyle={styles.buttonLabel}
            primary
            onClick={() => { window.location = '/' }}
            label='RETURN TO HOMEPAGE' />
        </div>
      </div>
    } else {
      claimButton = <div style={styles.claimButton}>
        <div style={styles.header}>
          {template.granter.name} will need to know a little about you before granting you
          this badge. What would you like to share?
        </div>
        <div style={styles.requestBadge}>
          <div style={styles.editNametag}>
            <EditNametag
              nametagEdit={nametag}
              me={me}
              requiredTemplates={[]}
              addNametagEditBadge={addNametagEditBadge}
              removeNametagEditBadge={removeNametagEditBadge}
              updateNametagEdit={updateNametagEdit}
              template={template.id} />
            <div style={styles.userBadges}>
              <UserBadges
                selectedBadges={nametag && nametag.badges}
                badges={me.badges} />
            </div>
          </div>
          <div style={styles.editNametag}>
            <RaisedButton
              style={styles.button}
              labelStyle={styles.buttonLabel}
              primary
              onClick={this.onRequestClick}
              label='REQUEST THIS BADGE' />
          </div>
        </div>
      </div>
    }

    return <div>
      <NavBar
        empty />
      <div style={styles.certDetailContainer}>
        <div style={styles.header}>
          <h3>Request This Badge</h3>
           Badges let others know why you are worthy of trust and respect.
           They can also give you access to exclusive communities.
        </div>
        <div style={styles.certDetail}>
          <Badge
            badge={{template, notes: [], id: 'template'}}
            draggable={false}
            expanded />
        </div>
        {claimButton}
      </div>
    </div>
  }
}

BadgeDetail.propTypes = {
  createNametag: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    template: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      granter: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
      }).isRequired
    }),
    me: PropTypes.shape({
      displayNames: PropTypes.arrayOf(PropTypes.string).isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      badges: PropTypes.arrayOf(PropTypes.object.isRequired)
    })
  }).isRequired
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

  copySuccess: {
    color: 'green',
    fontSize: 12
  },
  requestBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  },
  editNametag: {
    margin: 10
  }
}
