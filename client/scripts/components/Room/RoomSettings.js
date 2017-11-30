import React from 'react'
import Toggle from 'material-ui/Toggle'
import t from '../../utils/i18n'

const RoomSettings = ({modOnlyDMs, closed, roomId, updateRoom}) => <div>
  <Toggle
    label={modOnlyDMs ? t('room.priv_msg_off') : t('room.priv_msg_on')}
    toggled={!modOnlyDMs}
    onToggle={() => updateRoom(roomId, {modOnlyDMs: !modOnlyDMs})}
    labelStyle={styles.labelStyle}
    thumbStyle={styles.thumbOff}
    thumbSwitchedStyle={styles.thumbSwitched}
    trackSwitchedStyle={styles.trackSwitched} />
  <Toggle
    label={closed ? t('room.closed') : t('room.open')}
    toggled={!closed}
    onToggle={() => updateRoom(roomId, {closed: !closed})}
    labelStyle={styles.labelStyle}
    thumbStyle={styles.thumbOff}
    thumbSwitchedStyle={styles.thumbSwitched}
    trackSwitchedStyle={styles.trackSwitched} />
</div>

export default RoomSettings

const styles = {
  thumbOff: {
    backgroundColor: 'white'
  },
  trackOff: {
    backgroundColor: '#ff9d9d'
  },
  thumbSwitched: {
    backgroundColor: '#22c7ba'
  },
  trackSwitched: {
    backgroundColor: 'white'
  },
  labelStyle: {
    color: 'white',
    marginLeft: 10,
    fontSize: 12
  }
}
