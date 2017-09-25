import React, {PropTypes} from 'react'
import WelcomeForm from './WelcomeForm'
// import ChoosePrivacy from './ChoosePrivacy'
import HostIntro from './HostIntro'
import Login from '../../User/Login'
import ChooseNorms from './ChooseNorms'
import Toggle from 'material-ui/Toggle'
import {track} from '../../../utils/analytics'
import {grey} from '../../../../styles/colors'

const getForm = ({
    error,
    stepIndex,
    updateRoom,
    nametagEdits,
    selectedBadges,
    updateNametagEdit,
    setClosed,
    closedIn,
    room,
    badges,
    handleNext,
    handlePrev,
    setImageFromUrl,
    loginUser,
    passwordResetRequest,
    registerUser,
    addNametagEditBadge,
    removeNametagEditBadge,
    addSelectedBadge,
    removeSelectedBadge,
    me,
    norms,
    addNorm,
    removeNorm
  }) => {
  switch (stepIndex) {
    case 0:
      return <div>
        <WelcomeForm
          error={error}
          updateRoom={updateRoom}
          welcome={room.welcome} />
      </div>
    case 1:
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
      // track('CREATE_ROOM_TITLE')
      return <div>
        {
          me
          ? <HostIntro
            nametagEdits={nametagEdits}
            selectedBadges={selectedBadges}
            addNametagEditBadge={addNametagEditBadge}
            removeNametagEditBadge={removeNametagEditBadge}
            updateNametagEdit={updateNametagEdit}
            me={me}
            error={error} />
        : <div>
          <h2>Create Account</h2>
          <Login
            registerUser={registerUser}
            loginUser={loginUser}
            message=''
            register
            passwordResetRequest={passwordResetRequest} />
        </div>
        }
      </div>
    case 3:
      track('ROOM_PRIVACY')
      return <div style={styles.container}>
        <h2>You're done!</h2>
        <Toggle
          style={styles.toggleStyle}
          label={room.public ? 'Make Discoverable' : 'Keep Private'}
          toggled={room.public}
          labelStyle={{textAlign: 'left'}}
          thumbStyle={{backgroundColor: grey}}
          onToggle={(e, isChecked) => updateRoom('public', isChecked)}
          />
        <div style={styles.helpText}>
          {
            room.public
            ? 'Once approved, your conversation will be discoverable on Nametag.'
            : 'Your conversation will only be visible if you share its link.'
          }
        </div>
      </div>
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
  updateNametagEdit: func.isRequired,
  room: shape({
    title: string.isRequired,
    welcome: string.isRequired
  }).isRequired,
  registerUser: func.isRequired,
  loginUser: func.isRequired,
  passwordResetRequest: func.isRequired,
  nametagEdits: object.isRequired,
  addNametagEditBadge: func.isRequired,
  removeNametagEditBadge: func.isRequired,
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
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  chooseNorms: {
    width: 450,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  helpText: {
    color: grey,
    fontSize: 14,
    width: 450,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 40
  },
  toggleStyle: {
    width: 200
  }
}
