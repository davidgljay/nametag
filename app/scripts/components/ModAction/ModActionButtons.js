import React, {PropTypes} from 'react'
import style from '../../../styles/ModAction/ModActionButtons.css'
import { CardActions, Button } from 'react-mdl'

const ModActionButtons = (props) => <CardActions border>
    <Button
      colored
      raised
      onClick={props.remindOfNorms}>
      Send Message
    </Button>
    <Button
      className={style.severe}
      onClick={props.removeMessage}>
        Remove Message
    </Button>
    <Button
      className={style.severe}
      onClick={props.removeUser}>
        Ban User
    </Button>
    <Button
      className={style.severe}
      onClick={props.notifyBadge}>
        Report User
    </Button>
  </CardActions>

ModActionButtons.propTypes = {
  remindOfNorms: PropTypes.func.isRequired,
  escalated: PropTypes.bool.isRequired,
  escalate: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  authorName: PropTypes.string.isRequired,
  notifyBadge: PropTypes.func.isRequired,
}

export default ModActionButtons
