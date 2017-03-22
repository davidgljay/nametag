import React, {Component, PropTypes} from 'react'
import {mobile} from '../../../styles/sizes'
import FontIcon from 'material-ui/FontIcon'
import radium from 'radium'
import {grey500, yellow800} from 'material-ui/styles/colors'

class MessageMenu extends Component {

  constructor (props) {
    super(props)

    this.toggleActions = () => {
      this.setState({showActions: !this.state.showActions})
    }
  }

  render () {
    const {id, saved, showModAction, showActions, toggleSaved, isDM} = this.props
    const isMobile = window.innerWidth < 800
    const starStyle = saved ? {...styles.actionIcon, ...styles.savedIcon} : styles.actionIcon
    return <div style={styles.actionsContainer}>
      {
        !isMobile || showActions
        ? <div style={styles.actions} key='actions'>
          {
            !isDM &&
            <FontIcon
              key='starIcon'
              className='material-icons'
              onClick={() => toggleSaved(id, !saved)}
              style={starStyle}>
              star
            </FontIcon>
          }
          <FontIcon
            key='flagIcon'
            className='material-icons'
            style={styles.actionIcon}
            onClick={showModAction(true)}>
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

MessageMenu.propTypes = {
  showModAction: PropTypes.func.isRequired,
  showActions: PropTypes.bool.isRequired,
  isDM: PropTypes.bool.isRequired,
  toggleSaved: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  id: PropTypes.string.isRequired
}

export default radium(MessageMenu)

const styles = {
  actionsContainer: {
    marginTop: 5,
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  actionIcon: {
    cursor: 'pointer',
    color: grey500,
    marginRight: 5,
    fontSize: 'inherit',
    opacity: 0.5,
    [mobile]: {
      marginLeft: 10
    }
  },
  savedIcon: {
    color: yellow800
  },
  actions: {
    height: 22,
    display: 'inline-block',
    fontSize: 14,
    [mobile]: {
      fontSize: 32,
      display: 'block',
      height: 36
    }
  }
}
