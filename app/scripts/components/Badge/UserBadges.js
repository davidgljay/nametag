import React, { Component, PropTypes } from 'react'
import Badge from '../../containers/Badge/BadgeContainer'
import CreateBadge from '../../containers/Badge/CreateBadgeContainer'
import FlatButton from 'material-ui/FlatButton'
import {grey500} from 'material-ui/styles/colors'

class UserBadges extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showCreateCert: false
    }

    this.onCreateCertClick = () => {
      this.setState({showCreateCert: !this.state.showCreateCert})
    }

    this.mapBadges = (badges) => {
      if (badges.length === 0) {
        return <div style={styles.noCerts}>
          You do not currently have any badges, want to add some?
        </div>
      }
      return badges
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
            <Badge
              id={certificateId}
              draggable />
          </div>)
    }
  }

  componentDidMount () {
    if (!this.context.user ||
      !this.context.user.data ||
      !this.context.user.data.badges) {
      return
    }
    let badges = this.context.user.data.badges
    for (let i = 0; i < badges.length; i++) {
      this.props.fetchBadge(badges[i])
    }
  }

  render () {
    if (!this.context.user ||
      !this.context.user.data ||
      !this.context.user.data.badges) {
      return
    }
    return <div id='badges' style={styles.container}>
      {
        this.mapBadges(this.context.user.data.badges)
      }
      <FlatButton
        label='ADD BADGE'
        onClick={this.onCreateCertClick} />
      {
            this.state.showCreateCert &&
            <CreateBadge
              mini
              toggleCreateCert={this.onCreateCertClick} />
          }
    </div>
  }
}

export default UserBadges

UserBadges.contextTypes = {
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
