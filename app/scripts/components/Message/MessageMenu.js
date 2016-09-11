import React, {PropTypes} from 'react'
import style from '../../../styles/Message/MessageMenu.css'
import EmojiReactions from './EmojiReactions'
import {Icon} from 'react-mdl'

const wrapperStyle = {
  height: '2em',
}
const selectorStyle = {
  position: 'absolute',
  left: 'unset',
  top: 'unset',
}
const xStyle = {
  color: 'black',
  marginTop: -45,
  marginRight: 7,
}

const MessageMenu = (props) =>
<div className={style.actions + ' ' + props.showActions }>
  <EmojiReactions
      reactions={[{name: 'blush', count: 1}]}
      onReaction={this.props.onReaction}
      onEmojiClick={this.props.onEmojiClick}
      wrapperStyle={wrapperStyle}
      selectorStyle={selectorStyle}
      xStyle={xStyle}/>
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

MessageMenu.propTypes = {
  toggleActions: PropTypes.func.isRequired,
  heartAction: PropTypes.func.isRequired,
  modAction: PropTypes.func.isRequired,

}
