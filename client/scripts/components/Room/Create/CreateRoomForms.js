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
    updateNametagEdit,
    setClosed,
    closedIn,
    room,
    badges,
    selectedBadges,
    searchImage,
    handleNext,
    handlePrev,
    setImageFromUrl,
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
      // return <div>
      //   <h4>What would you like to talk about?</h4>
      //   <TitleForm
      //     error={error}
      //     updateRoom={updateRoom}
      //     setClosed={setClosed}
      //     closedIn={closedIn}
      //     title={room.title}
      //     desc={room.description} />
      //   <ChoosePrivacy
      //     badges={badges}
      //     adminTemplates={me.adminTemplates}
      //     selectedBadges={selectedBadges}
      //     addSelectedBadge={addSelectedBadge}
      //     removeSelectedBadge={removeSelectedBadge} />
      // </div>
    case 2:
      // track('CREATE_ROOM_TITLE')
      return <h1>Login</h1>
      //TODO: Add Login
      // return <div>
      //   {
      //     !room.image && <h4>Please select an image for this conversation.</h4>
      //   }
      //   <ImageSearch
      //     error={error}
      //     style={styles.imageSearch}
      //     handleNext={handleNext}
      //     handlePrev={handlePrev}
      //     setImageFromUrl={setImageFromUrl}
      //     searchImage={searchImage}
      //     updateRoom={updateRoom} />
      // </div>
    case 3:
      return <div>
        <HostIntro
          nametagEdits={nametagEdits}
          selectedBadges={selectedBadges}
          addNametagEditBadge={addNametagEditBadge}
          removeNametagEditBadge={removeNametagEditBadge}
          updateNametagEdit={updateNametagEdit}
          me={me}
          error={error}
          />
      </div>
    case 4:
      track('CREATE_ROOM_NORMS')
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
            : 'Your conversation will only be visible if you share a link.'
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
    image: string.isRequired,
    description: string.isRequired
  }).isRequired,
  searchImage: func.isRequired,
  setImageFromUrl: func.isRequired,
  nametagEdits: object.isRequired,
  addNametagEditBadge: func.isRequired,
  removeNametagEditBadge: func.isRequired,
  me: shape({
    badges: arrayOf(shape({
      id: string.isRequired
    })).isRequired
  }).isRequired,
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
    width: 400,
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
