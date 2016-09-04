import React from 'react'
import style from '../../../styles/Message/MessageMenu.css'

const MessageMenu = (props) =>
<div className={style.actions + ' ' + this.state.showActions }>
  <span
    className={style.showActions + ' ' + style.actionIcon + ' glyphicon glyphicon-option-vertical'}
    onClick={props.toggleActions}
    aria-hidden="true"/>
  <span
    className={style.actionIcon + ' glyphicon glyphicon-star'}
    aria-hidden="true"/>
  <span className={style.actionIcon + ' glyphicon glyphicon-heart'}
  aria-hidden="true"
  onClick={props.heartAction}/>
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
