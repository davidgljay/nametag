import React, {PropTypes} from 'react'
import QRcode from 'qrcode.react'
import Badge from './Badge'
import Navbar from '../Utils/Navbar'
import CircularProgress from 'material-ui/CircularProgress'
import FlatButton from 'material-ui/FlatButton'
import t from '../../utils/i18n'

const ShareBadge = ({data: {loading, template}}) => <div>
  <Navbar empty />
  {
    loading
    ? <div style={styles.shareBadgeContainer}>
      <CircularProgress />
    </div>
    : <div id='shareBadge' style={styles.shareBadgeContainer}>
      <Badge
        badge={{template, notes: [], id: 'template'}}
        draggable={false}
        expanded />
      <div style={styles.QRcode}>
        <QRcode value={`https://nametag.chat/badges/${template.id}`} size={256} />
      </div>
      <FlatButton
        labelStyle={styles.buttonLabel}
        primary
        label={t('back')}
        onClick={() => history.back()} />
    </div>
  }
</div>

const {shape, string, bool} = PropTypes

ShareBadge.propTypes = {
  data: shape({
    template: shape({
      id: string.isRequired
    }),
    loading: bool.isRequired
  }).isRequired
}

export default ShareBadge

const styles = {
  QRcode: {
    margin: 30
  },
  shareBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 20
  }
}
