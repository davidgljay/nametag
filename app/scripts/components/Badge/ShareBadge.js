import React, {PropTypes} from 'react'
import QRcode from 'qrcode.react'
import Badge from './Badge'

const ShareBadge = ({template}) => <div id='shareBadge' style={styles.shareBadgeContainer}>
  <Badge
    badge={{template, notes: [], id: 'template'}}
    draggable={false}
    expanded />
  <div style={styles.QRcode}>
    <QRcode value={`https://nametag.chat/badges/${template.id}`} size={256} />
  </div>
</div>

const {shape, string} = PropTypes

ShareBadge.propTypes = {
  template: shape({
    id: string.isRequired
  }).isRequired
}

export default ShareBadge

const styles = {
  QRcode: {
    margin: 20
  },
  shareBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
}
