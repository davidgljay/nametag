import React, {PropTypes} from 'react'
import t from '../../utils/i18n'

const getUrl = shortLink => encodeURI(`https://nametag.chat/r/${shortLink}`)

const twitterLink = (shortLink, title) => `https://twitter.com/intent/tweet?text=${encodeURI(t('room.invite_twitter') + title)}&url=${getUrl(shortLink)}&via=NametagChat`

const fbLink = (shortLink, roomId, title) => `https://www.facebook.com/dialog/share?app_id=672526412895563&display=page&href=${getUrl(shortLink)}&redirect_uri=${encodeURI(`https://nametag.chat/rooms/${roomId}`)}`

const emailLink = (shortLink, title) => `mailto:?subject=${encodeURI(title)}&body=${encodeURI(t('room.invite_email'))}${getUrl(shortLink)}`

const ShareButtons = ({shortLink, title, roomId}) => <div style={styles.container}>
  <div style={styles.header}>{t('room.invite')}</div>
  <div id='twitterShare' style={styles.share}>
    <a href={twitterLink(shortLink, title)} target='_blank'><img style={styles.image} src='https://s3.amazonaws.com/nametag_images/white-twitter-30.png' /></a>
  </div>
  <div id='fbShare' style={styles.share}>
    <a href={fbLink(shortLink, roomId, title)} target='_blank'><img style={styles.image} src='https://s3.amazonaws.com/nametag_images/facebook-logo-white-30.png' /></a>
  </div>
  <div id='emailShare' style={styles.share}>
    <a href={emailLink(shortLink, title)} target='_blank'><img style={styles.image} src='https://s3.amazonaws.com/nametag_images/icon_email_30.png' /></a>
  </div>
</div>

const {string} = PropTypes

ShareButtons.proptypes = {
  roomId: string.isRequired,
  title: string.isRequired,
  shortLink: string.isRequired
}

export default ShareButtons

const styles = {
  header: {
    color: '#fff',
    verticalAlign: 'middle',
    flex: 1
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  share: {
    margin: 10,
    display: 'flex',
    alignItems: 'center'
  },
  image: {
    width: 20
  }
}
