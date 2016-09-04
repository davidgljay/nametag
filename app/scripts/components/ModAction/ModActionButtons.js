import React, {PropTypes} from 'react'
import style from '../../../styles/ModAction/ModActionButtons.css'

const ModActionButtons = (props) => <div className={style.modAction}>
    <button className={style.primary} onClick={props.remindOfNorms}>
      Remind
    </button>
    <button
      className={style.escalateLink + ' ' + (!props.escalated || style.hide)}
      onClick={props.escalate}>
        Escalate
    </button>
    <button
      className={style.danger + ' ' + (props.escalated || style.hide)}
      onClick={props.removeUser}>
        Remove {props.authorName} From Room
    </button>
    <button
      className={style.danger + ' ' + (props.escalated || style.hide)}
      onClick={props.notifyBadge}>
        Notify Badge Granters
    </button>
  </div>

ModActionButtons.propTypes = {
  remindOfNorms: PropTypes.func.isRequired,
  escalated: PropTypes.bool.isRequired,
  escalate: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  authorName: PropTypes.string.isRequired,
  notifyBadge: PropTypes.func.isRequired,
}

export default ModActionButtons
