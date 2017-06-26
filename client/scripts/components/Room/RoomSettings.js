import React from 'react'
import Toggle from 'material-ui/Toggle'

const RoomSettings = ({modOnlyDMs, roomId, setModOnlyDMs}) => <div>
  <Toggle
    label='Limit Private Messaging to Room Host'
    toggled={modOnlyDMs}
    onClick={() => setModOnlyDMs(roomId, !modOnlyDMs)}
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
