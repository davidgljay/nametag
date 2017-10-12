import React, {PropTypes} from 'react'
import FlatButton from 'material-ui/FlatButton'
import Badge from '../Badge/Badge'
import {grey} from '../../../styles/colors'

const BadgeOffer = ({template}) => <div>
  <div style={styles.badgeOffer}>
    <div>You have been offered the</div>
    <Badge badge={{
      template,
      notes: [],
      id: 'temp'
    }} />
    <div>badge.</div>
  </div>
  <div style={styles.ask}>
    {
      `Now's a great time to show your support for ${template.granter.name},
    would you like to make a suggested donation?`
    }
  </div>
  <div style={styles.donationContainer}>
    <div id='donation' style={styles.donation}>
      <div style={styles.donationOption}>$10</div>
      <div style={{...styles.donationOption, ...styles.selected}}>$25</div>
      <div style={styles.donationOption}>$50</div>
      <div style={styles.donationOptionLast}>$__</div>
    </div>
    <FlatButton
      primary
      label='Sounds Great!' />
  </div>
</div>

const {string, shape} = PropTypes

BadgeOffer.proptypes = {
  template: shape({
    id: string.isRequired,
    granter: shape({
      id: string.isRequired,
      name: string.isRequired
    })
  })
}

export default BadgeOffer

const styles = {
  badgeOffer: {
    fontWeight: 300,
    color: grey,
    display: 'flex',
    lineHeight: '30px',
    marginTop: 10
  },
  ask: {
    color: grey,
    fontWeight: 300
  },
  donationContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 20
  },
  donation: {
    borderRadius: 3,
    border: `1px solid ${grey}`,
    display: 'flex',
    fontWeight: '300',
    marginRight: 10
  },
  donationOption: {
    padding: 8,
    borderRight: `1px solid ${grey}`,
    cursor: 'pointer'
  },
  donationOptionLast: {
    padding: 8,
    cursor: 'pointer'
  },
  selected: {
    backgroundColor: 'lightgrey'
  }
}
