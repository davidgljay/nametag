import React, { Component, PropTypes } from 'react'
import Badge from '../../containers/Badge/BadgeContainer'
import CreateBadge from '../../containers/Badge/CreateBadgeContainer'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import {grey500} from 'material-ui/styles/colors'

class UserBadges extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showCreateBadge: false
    }

    this.onCreateBadgeClick = () => {
      this.setState({showCreateBadge: !this.state.showCreateBadge})
    }

    this.mapBadges = (badges) => {
      const {selectedBadges} = this.props
      if (!badges || badges.length === 0) {
        return <div style={styles.noBadges}>
          You do not currently have any badges, want to add some?
        </div>
      }
      return <div>
        <p style={styles.userBadgeText}>
          <FontIcon
            style={styles.userBadgeIcon}
            className='material-icons'>arrow_upward</FontIcon>
          Drag to Share
          <FontIcon
            style={styles.userBadgeIcon}
            className='material-icons'>arrow_upward</FontIcon>
        </p>
        {
          badges
            .filter((badgeId) => {
              if (!selectedBadges) {
                return true
              }
              return selectedBadges.reduce((bool, badge) =>
                bool && badge.id !== badgeId, true)
            })
            .map((badgeId) =>
              <div key={badgeId}>
                <Badge
                  id={badgeId}
                  draggable />
              </div>)
        }
      </div>
    }
  }

  render () {
    const {badges} = this.props
    if (!badges) {
      return null
    }
    return <div id='badges' style={styles.container}>
      {
        this.mapBadges(badges)
      }
      <FlatButton
        label='ADD BADGE'
        onClick={this.onCreateBadgeClick} />
      {
        this.state.showCreateBadge &&
        <CreateBadge
          mini
          toggleCreateBadge={this.onCreateBadgeClick} />
      }
    </div>
  }
}

export default UserBadges

UserBadges.propTypes = {
  selectedBadges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string
  })),
  badges: PropTypes.arrayOf(PropTypes.string)
}

const styles = {
  noBadges: {
    color: grey500
  },
  userBadgeText: {
    color: grey500
  },
  userBadgeIcon: {
    color: grey500
  },
  container: {
    width: '100%'
  }
}
