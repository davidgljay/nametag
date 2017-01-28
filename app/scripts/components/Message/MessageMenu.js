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
    const { id, modAction} = this.props
    const { showActions } = this.state
    const isMobile = window.innerWidth < 800
    let actionAnim = showActions ? styles.slideOutActions : styles.slideInActions
    let leftChevAnim = showActions ? styles.fadeOut : styles.fadeIn
    return <div style={styles.actionsContainer}>
      <div style={{...styles.actions, ...actionAnim}} key='actions'>
        {
          isMobile && <FontIcon
            key='chevronLeft'
            className='material-icons'
            style={{...styles.actionIcon, ...leftChevAnim}}
            onClick={this.toggleActions}>
            chevron_left
          </FontIcon>
        }
        <FontIcon
          key='starIcon'
          className='material-icons'
          style={styles.actionIcon}>
          star
        </FontIcon>
        <FontIcon
          key='flagIcon'
          className='material-icons'
          style={styles.actionIcon}
          onClick={modAction(true)}>
          flag
        </FontIcon>
        {
          isMobile && <FontIcon
            key='chevronRight'
            className='material-icons'
            style={styles.actionIcon}
            onClick={this.toggleActions}>
            chevron_right
          </FontIcon>
        }
      </div>
    </div>
  }
}

export default radium(MessageMenu)

MessageMenu.propTypes = {
  toggleActions: PropTypes.func.isRequired,
  modAction: PropTypes.func.isRequired,
}

const slideOut = keyframes({ '0%': { left: 120 }, '100%': { left: 35 } })
const slideIn = keyframes({ '0%': { left: 35 }, '100%': { left: 120 } })
const fadeOut = keyframes({
  '0%': { opacity: 0.8 },
  '100%': { opacity: 0 },
})
const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.8 },
})

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
  },
  actions: {
    height: 22,
    display: 'inline-block',
    fontSize: 14,
    [mobile]: {
      height: 'auto',
      float: 'right',
      verticalAlign: 'top',
      position: 'relative',
      top: -21,
      left: 170,
      background: 'white',
      borderRadius: 3,
      padding: 5,
      fontSize: 24,
    },
  },
  fadeOut: {
    opacity: 0,
  },
  fadeIn: {
    opacity: 0.8,
  },
  slideInActions: {
    animationName: slideIn,
    animationDuration: '500ms',
    animationFillMode: 'forwards',
  },
  slideOutActions: {
    animationName: slideOut,
    animationDuration: '500ms',
    animationFillMode: 'forwards',
  },
}
