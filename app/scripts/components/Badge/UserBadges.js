import React, { Component, PropTypes } from 'react'
import Badge from './Badge'
import CreateBadge from '../../containers/Badge/CreateBadgeContainer'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import {grey} from '../../../styles/colors'

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
        <div style={styles.badgesContainer}>
          {
            badges
              .filter((badge) => {
                if (!selectedBadges) {
                  return true
                }
                return selectedBadges.reduce((bool, selected) =>
                  bool && selected.id !== badge.id, true)
              })
              .map((badge) => <div key={badge.id}>
                <Badge
                  badge={badge}
                  draggable />
              </div>)
          }
        </div>
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
  badges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  }))
}

const styles = {
  noBadges: {
    color: grey
  },
  userBadgeText: {
    color: grey
  },
  userBadgeIcon: {
    color: grey
  },
  container: {
    width: '100%'
  },
  badgesContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
}
