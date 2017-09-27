import React, {PropTypes} from 'react'

const getUrl = id => encodeURI(`https://nametag.chat/rooms/${id}`)

const twitterLink = (roomId, title) => `https://twitter.com/intent/tweet?text=${encodeURI('Join the conversation: ' + title)}&url=${getUrl(roomId)}&via=NametagChat`

const fbLink = (roomId, title) => `https://www.facebook.com/dialog/share?app_id=672526412895563&display=page&href=${getUrl(roomId)}&redirect_uri=${getUrl(roomId)}`

const emailLink = (roomId, title) => `mailto:?subject=${encodeURI(title)}&body=${encodeURI('There\'s an interesting conversation going on, want to join?\n\n')}${getUrl(roomId)}`

const ShareButtons = ({roomId, title}) => <div style={styles.container}>
  <div style={{color: '#fff', verticalAlign: 'middle', flex: 1, fontWeight: 'bold'}}>Share</div>
  <div id='twitterShare' style={styles.share}>
    <a href={twitterLink(roomId, title)} target='_blank'><img style={styles.image} src='https://s3.amazonaws.com/nametag_images/white-twitter-30.png' /></a>
  </div>
  <div id='fbShare' style={styles.share}>
    <a href={fbLink(roomId, title)} target='_blank'><img style={styles.image} src='https://s3.amazonaws.com/nametag_images/facebook-logo-white-30.png' /></a>
  </div>
  <div id='emailShare' style={styles.share}>
    <a href={emailLink(roomId, title)} target='_blank'><img style={styles.image} src='https://s3.amazonaws.com/nametag_images/icon_email_30.png' /></a>
  </div>
</div>

const {string} = PropTypes

ShareButtons.proptypes = {
  roomId: string.isRequired,
  title: string.isRequired
}

export default ShareButtons

const styles = {
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
