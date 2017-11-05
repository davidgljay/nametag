import React, {Component, PropTypes} from 'react'
import {mobile} from '../../../styles/sizes'
import FontIcon from 'material-ui/FontIcon'
import radium from 'radium'
import {grey, primary} from '../../../styles/colors'

class MessageMenu extends Component {

  constructor (props) {
    super(props)

    this.toggleActions = () => {
      this.setState({showActions: !this.state.showActions})
    }
  }

  render () {
    const {id, showModAction, toggleEmoji, showActions, showReplies, isDM, isReply} = this.props
    const isMobile = false
    return <div style={styles.actionsContainer}>
      {
        !isMobile || showActions
        ? <div style={styles.actions} key='actions'>
          {
            !isDM &&
            <FontIcon
              style={styles.actionIcon}
              onClick={toggleEmoji(id)}
              className='material-icons'>
              tag_faces
            </FontIcon>
          }
          <FontIcon
            key='flagIcon'
            className='material-icons'
            style={styles.actionIcon}
            onClick={showModAction(true)}>
            flag
          </FontIcon>
          {
            !isReply &&
            <FontIcon
              key='replyIcon'
              className='material-icons'
              style={styles.actionIcon}
              onClick={showReplies(true)}>
              reply
            </FontIcon>
          }
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

const {func, bool, string} = PropTypes
MessageMenu.propTypes = {
  showModAction: func.isRequired,
  showActions: bool.isRequired,
  isDM: bool.isRequired,
  showReplies: func.isRequired,
  toggleEmoji: func.isRequired,
  id: string.isRequired
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
    color: grey,
    marginRight: 5,
    fontSize: 'inherit',
    opacity: 0.5,
    [mobile]: {
      marginLeft: 10
    }
  },
  savedIcon: {
    color: primary
  },
  actions: {
    height: 22,
    display: 'inline-block',
    fontSize: 16
  }
}
