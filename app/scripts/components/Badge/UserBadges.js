import React, { Component, PropTypes } from 'react'
import Badge from '../../containers/Badge/BadgeContainer'
import CreateBadge from '../../containers/Badge/CreateBadgeContainer'
import FlatButton from 'material-ui/FlatButton'
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
      if (badges.length === 0) {
        return <div style={styles.noBadges}>
          You do not currently have any badges, want to add some?
        </div>
      }
      return badges
        .filter((badgeId) => {
          if (!this.props.selectedBadges) {
            return true
          }
          this.props.selectedBadges.map((badge) => {
            if (badge.id === badgeId) {
              return false
            }
          })
          return true
        })
        .map((badgeId) =>
          <div key={badgeId}>
            <Badge
              id={badgeId}
              draggable />
          </div>)
    }
  }

  render () {
    if (!this.context.user ||
      !this.context.user.data ||
      !this.context.user.data.badges) {
      return null
    }
    return <div id='badges' style={styles.container}>
      {
        this.mapBadges(this.context.user.data.badges)
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
  selectedBadges: PropTypes.arrayOf(PropTypes.string)
}

UserBadges.contextTypes = {
  user: PropTypes.object
}

const styles = {
  noBadges: {
    color: grey500
  },
  container: {
    width: '100%'
  }
}
