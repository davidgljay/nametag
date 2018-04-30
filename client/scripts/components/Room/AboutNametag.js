import React from 'react'
import t from '../../utils/i18n'
import RaisedButton from 'material-ui/RaisedButton'

const AboutNametag = ({next}) => <div style={styles.container}>
  <div>
    {t('room.about_nametag')}
  </div>
  <img src='https://s3.amazonaws.com/nametag_images/site/welcomeimagesm.jpg' alt='Dinner Party' />
  <RaisedButton
    primary
    onClick={next}
    id='aboutNametagNext'
    label={t('room.got_it')} />
</div>

export default AboutNametag

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: 260
  }
}
