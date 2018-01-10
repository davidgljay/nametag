import React, {PropTypes} from 'react'
import WelcomeForm from './WelcomeForm'
// import ChoosePrivacy from './ChoosePrivacy'
import HostIntro from './HostIntro'
import Login from '../../../containers/User/LoginContainer'
import ChooseNorms from './ChooseNorms'
import Toggle from 'material-ui/Toggle'
import RoomCard from '../RoomCard'
import VolDonation from './VolDonation'
import {track} from '../../../utils/analytics'
import {grey} from '../../../../styles/colors'
import t from '../../../utils/i18n'

const getForm = ({
    error,
    stepIndex,
    updateRoom,
    selectedBadges,
    updateMod,
    setClosed,
    closedIn,
    room,
    badges,
    refetch,
    handleNext,
    handlePrev,
    setImageFromUrl,
    addModBadge,
    removemodBadge,
    addSelectedBadge,
    removeSelectedBadge,
    me,
    norms,
    addNorm,
    removeNorm
  }) => {
  const doneScreen = <div style={styles.container}>
    <div style={styles.preview}>
      <RoomCard room={room} disabled />
    </div>
    <h2>{t('create_room.done')}</h2>
    <div style={styles.privacyContainer}>
      <Toggle
        style={styles.toggleStyle}
        label={room.public ? t('create_room.room_pub_on') : t('create_room.room_pub_off')}
        toggled={room.public}
        labelStyle={{textAlign: 'left'}}
        thumbStyle={{backgroundColor: grey}}
        onToggle={(e, isChecked) => updateRoom('public', isChecked)} />
      <div style={styles.helpText}>
        {
          room.public
          ? t('create_room.room_pub_on_help')
          : t('create_room.room_pub_off_help')
        }
      </div>
    </div>
  </div>

  switch (stepIndex) {
    case 0:
      return <div>
        <WelcomeForm
          error={error}
          updateRoom={updateRoom}
          welcome={room.welcome} />
      </div>
    case 1:
      track('WELCOME_FORMS')
      return <div>
        <ChooseNorms
          error={error}
          style={styles.chooseNorms}
          addNorm={addNorm}
          normsObj={norms}
          updateRoom={updateRoom}
          room={room}
          removeNorm={removeNorm} />
      </div>
    case 2:
      track('CHOOSE_NORMS')
      return <div>
        {
          me
          ? <HostIntro
            mod={room.mod}
            selectedBadges={selectedBadges}
            addModBadge={addModBadge}
            removemodBadge={removemodBadge}
            updateMod={updateMod}
            me={me}
            error={error} />
        : <div>
          <h2>{t('create_room.create_account')}</h2>
          <Login
            onLogin={refetch}
            message='' />
        </div>
        }
      </div>
    case 3:
      track('HOST_INTRO')
      return me.granters
      ? <VolDonation
        granters={me.granters}
        room={room}
        email={me.email}
        updateRoom={updateRoom} />
      : doneScreen
    case 4:
      return doneScreen
    default:
      return 'Something has gone wrong!'
  }
}

const CreateRoomForms = (props) => {
  return <div>
    {
      getForm(props)
    }
  </div>
}

const {string, number, func, shape, object, arrayOf} = PropTypes

CreateRoomForms.propTypes = {
  error: object,
  stepIndex: number.isRequired,
  updateRoom: func.isRequired,
  updateMod: func.isRequired,
  room: shape({
    title: string,
    welcome: string.isRequired,
    mod: object.isRequired
  }).isRequired,
  refetch: func.isRequired,
  addModBadge: func.isRequired,
  removeModBadge: func.isRequired,
  me: shape({
    badges: arrayOf(shape({
      id: string.isRequired
    })).isRequired
  }),
  norms: object.isRequired,
  addNorm: func.isRequired,
  removeNorm: func.isRequired
}

export default CreateRoomForms

const styles = {
  privacyContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  chooseNorms: {
    maxWidth: 450,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  helpText: {
    color: grey,
    fontSize: 14,
    width: 450,
    marginTop: 20,
    marginBottom: 40
  },
  toggleStyle: {
    width: 200
  },
  preview: {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}
