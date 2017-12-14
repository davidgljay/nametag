import React from 'react'
import { CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {red} from '../../../styles/colors'
import t from '../../utils/i18n'

const ModActionButtons = (props) => <CardActions>
  <RaisedButton
    fullWidth
    primary
    labelStyle={styles.primary}
    onClick={props.remindOfNorms}
    label={t('mod_action.send')} />
  {
      props.isMod &&
      <div>
        <FlatButton
          style={styles.severe}
          onClick={props.removeMessage}
          label={t('mod_action.remove')} />
        <FlatButton
          style={styles.severe}
          onClick={props.ban}
          label={t('mod_action.ban')} />
      </div>
    }
</CardActions>

export default ModActionButtons

const styles = {
  primary: {
    color: '#FFF',
    padding: '0px 10px'
  },
  severe: {
    color: red,
    marginTop: 10
  }
}
