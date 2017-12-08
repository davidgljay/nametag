import React, {PropTypes} from 'react'
import FlatButton from 'material-ui/FlatButton'
import Badge from '../Badge/Badge'
import radium from 'radium'
import {grey} from '../../../styles/colors'
import {mobile} from '../../../styles/sizes'
import t from '../../utils/i18n'

const BadgeOffer = ({template, myBadges, isRecipient}) =>
  <div>
    <div style={styles.badgeOffer}>
      <div>{t('message.badgeoffer_start')}</div>
      <div>
        <Badge badge={{
          template,
          notes: [],
          id: template.id
        }} />
      </div>
      <div>{t('message.badgeoffer_end')}</div>
    </div>
    {
      isRecipient &&
      !myBadges.find(badge => badge.template.id === template.id) &&
      <FlatButton
        primary
        label={t('message.badgeoffer_button')} />
    }

  </div>

const {string, shape, arrayOf, object, bool} = PropTypes

BadgeOffer.proptypes = {
  template: shape({
    id: string.isRequired,
    granter: shape({
      id: string.isRequired,
      name: string.isRequired
    })
  }),
  myBadges: arrayOf(object).isRequired,
  isRecipient: bool.isRequired
}

export default radium(BadgeOffer)

const styles = {
  badgeOffer: {
    fontWeight: 300,
    color: grey,
    display: 'flex',
    lineHeight: '30px',
    marginTop: 10,
    [mobile]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  ask: {
    color: grey,
    fontWeight: 300,
    marginTop: 15
  },
  donationContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 20,
    [mobile]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
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
