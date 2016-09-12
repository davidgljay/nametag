import React, {PropTypes} from 'react'
import style from '../../../styles/Message/MessageMenu.css'
import Reactions from '../../containers/Reaction/ReactionsContainer'

const MessageMenu = (props) =>
<div className={style.actions + ' ' + props.showActions }>
  <Reactions message={props.id} />
  <span
    className={style.showActions + ' ' + style.actionIcon + ' glyphicon glyphicon-option-vertical'}
    onClick={props.toggleActions}
    aria-hidden="true"/>
  <span
    className={style.actionIcon + ' glyphicon glyphicon-star'}
    aria-hidden="true"/>
  <span
    className={style.actionIcon + ' glyphicon glyphicon-flag'}
    onClick={props.modAction(true)}
    aria-hidden="true"/>
  <span
    className={style.hideActions + ' ' + style.actionIcon + ' glyphicon glyphicon-chevron-right'}
    onClick={props.toggleActions}
    aria-hidden="true"/>
</div>

export default MessageMenu

MessageMenu.propTypes = {
  toggleActions: PropTypes.func.isRequired,
  modAction: PropTypes.func.isRequired,
}
