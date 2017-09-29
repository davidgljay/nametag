import React, {PropTypes} from 'react'
import {grey} from '../../../styles/colors'

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
