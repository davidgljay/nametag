import React, {PropTypes} from 'react'
import {grey} from '../../../styles/colors'

// TODO: Replace this with a private authorless message to the host.
const HelpMessage = ({text}) => <div style={styles.helpText}>{text}</div>

const {string} = PropTypes

HelpMessage.proptypes = {
  text: string.isRequired
}

export default HelpMessage

const styles = {
  helpText: {
    color: grey,
    fontSize: 14,
    textAlign: 'center',
    width: '100%'
  }
}
