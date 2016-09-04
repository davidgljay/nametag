import React, {PropTypes} from 'react'
import style from '../../../styles/ModAction/ModActionButtons.css'
import {Button} from 'react-mdl'

const ModActionButtons = (props) => <div className={style.modAction}>
    <Button colored raised onClick={props.remindOfNorms}>
      Remind
    </Button>
    <Button
      raised
      className={style.escalateLink + ' ' + (!props.escalated || style.hide)}
      onClick={props.escalate}>
        Escalate
    </Button>
    <Button
      raised
      className={!props.escalated && style.hide}
      onClick={props.removeUser}>
        Remove {props.authorName} From Room
    </Button>
    <Button
      raised
      className={!props.escalated && style.hide}
      onClick={props.notifyBadge}>
        Notify Badge Granters
    </Button>
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
