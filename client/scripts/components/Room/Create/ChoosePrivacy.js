import React, {PropTypes, Component} from 'react'
import Badges from '../../Badge/Badges'
import {mobile} from '../../../../styles/sizes'
import radium from 'radium'
import { DropTarget } from 'react-dnd'
import { dragTypes } from '../../../constants'
import {grey} from '../../../../styles/colors'
import FontIcon from 'material-ui/FontIcon'

const privacyTarget = {
  drop (props, monitor) {
    props.addSelectedBadge(monitor.getItem())
  }
}

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class ChoosePrivacy extends Component {
  render () {
    const {badges, selectedBadges, connectDropTarget, removeSelectedBadge} = this.props
    const unselectedBadges = badges.filter(badge => {
      if (!selectedBadges) {
        return true
      }
      return selectedBadges.map(selected => selected.template.id).indexOf(badge.template.id) === -1
    })

    let header = 'Conversation is Public'

    if (selectedBadges.length > 1) {
      header = 'Conversation requires one or more of these badges:'
    } else if (selectedBadges.length === 1) {
      header = 'Conversation requires this badge:'
    }

    return <div style={styles.container}>
      {
        connectDropTarget(<div style={styles.target}>
          <div>{header}</div>
          <Badges
            draggable
            removeFromSource={removeSelectedBadge}
            badges={selectedBadges} />
        </div>)
      }
      {
        unselectedBadges.length > 0 &&
        <p style={styles.userBadgeText}>
          <FontIcon
            style={styles.userBadgeIcon}
            className='material-icons'>arrow_upward</FontIcon>
          Drag to Require
          <FontIcon
            style={styles.userBadgeIcon}
            className='material-icons'>arrow_upward</FontIcon>
        </p>
      }

      <Badges
        draggable
        badges={unselectedBadges} />
    </div>
  }
}

const {arrayOf, object, func} = PropTypes
ChoosePrivacy.propTypes = {
  badges: arrayOf(object).isRequired,
  selectedBadges: arrayOf(object).isRequired,
  addSelectedBadge: func.isRequired,
  removeSelectedBadge: func.isRequired,
  connectDropTarget: func.isRequired
}

export default DropTarget(dragTypes.badge, privacyTarget, collect)(radium(ChoosePrivacy))

const styles = {
  container: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: '20%',
    marginRight: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [mobile]: {
      marginLeft: '5%',
      marginRight: '5%'
    }
  },
  target: {
    minHeight: 60,
    padding: 5
  },
  userBadgeText: {
    color: grey
  },
  userBadgeIcon: {
    color: grey
  }
}
