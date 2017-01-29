import React, {Component, PropTypes} from 'react'
// import Reactions from '../../containers/Reaction/ReactionsContainer'
import {mobile} from '../../../styles/sizes'
import FontIcon from 'material-ui/FontIcon'
import radium, {keyframes} from 'radium'

class MessageMenu extends Component {
  static propTypes = {
    modAction: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
  }

  toggleActions = () => {
    this.setState({showActions: !this.state.showActions})
  }

  render() {
    const { modAction, showActions, type} = this.props
    const isMobile = window.innerWidth < 800
    return <div style={styles.actionsContainer}>
      {
        !isMobile || showActions ?
        <div style={styles.actions} key='actions'>
          {
            type === 'message' &&
            <FontIcon
              key='starIcon'
              className='material-icons'
              style={styles.actionIcon}>
              star
            </FontIcon>
          }
          <FontIcon
            key='flagIcon'
            className='material-icons'
            style={styles.actionIcon}
            onClick={modAction(true)}>
            flag
          </FontIcon>
        </div>
        : <div style={styles.actions} key='actions'>
            <FontIcon
                key='moreIcon'
                className='material-icons'
                style={styles.actionIcon}>
                more_horiz
            </FontIcon>
          </div>
      }
    </div>
  }
}

export default radium(MessageMenu)

MessageMenu.propTypes = {
  toggleActions: PropTypes.func.isRequired,
  modAction: PropTypes.func.isRequired,
}

const styles = {
  actionsContainer: {
    marginTop: 5,
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  actionIcon: {
    cursor: 'pointer',
    color: 'grey',
    marginRight: 5,
    fontSize: 'inherit',
    opacity: 0.5,
    [mobile]: {
      marginLeft: 10,
    },
  },
  actions: {
    height: 22,
    display: 'inline-block',
    fontSize: 14,
    [mobile]: {
      fontSize: 32,
      display: 'block',
      height: 36,
    },
  },
}
