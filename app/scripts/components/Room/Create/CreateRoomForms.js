import React, {PropTypes} from 'react'
import TitleForm from './TitleForm'
import ChoosePrivacy from './ChoosePrivacy'
import EditNametag from '../../Nametag/EditNametag'
import UserBadges from '../../Badge/UserBadges'
import ChooseNorms from './ChooseNorms'
import ImageSearch from './ImageSearch'
import {grey400} from 'material-ui/styles/colors'

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
        <h4>What would you like to talk about?</h4>
        <TitleForm
          error={error}
          updateRoom={updateRoom}
          setClosed={setClosed}
          closedIn={closedIn}
          title={room.title}
          desc={room.description} />
        <ChoosePrivacy
          badges={badges}
          selectedBadges={selectedBadges}
          addSelectedBadge={addSelectedBadge}
          removeSelectedBadge={removeSelectedBadge}
           />
      </div>
    case 1:
      return <div>
        <h4>Please select an image for this conversation.</h4>
        <ImageSearch
          error={error}
          style={styles.imageSearch}
          setImageFromUrl={setImageFromUrl}
          searchImage={searchImage}
          updateRoom={updateRoom} />
      </div>
    case 2:
      return <div>
        <h4>How would you like to appear in your room?</h4>
        <div style={styles.editNametagContainer}>
          <div>
            <EditNametag
              error={error}
              nametagEdit={nametagEdits.new}
              addNametagEditBadge={addNametagEditBadge}
              removeNametagEditBadge={removeNametagEditBadge}
              updateNametagEdit={updateNametagEdit}
              me={me}
              room='new' />
            <div style={styles.userBadges}>
              <UserBadges
                badges={me.badges}
                selectedBadges={nametagEdits.new && nametagEdits.new.badges} />
            </div>
          </div>
        </div>
      </div>
    case 3:
      return <div>
        <h4>Please set norms for this discussion.</h4>
        <ChooseNorms
          error={error}
          style={styles.chooseNorms}
          addNorm={addNorm}
          normsObj={norms}
          removeNorm={removeNorm} />
      </div>
    case 4:
      return <div>
        <h4>Ready to publish this conversation?</h4>
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

CreateRoomForms.propTypes = {
  error: PropTypes.string,
  stepIndex: PropTypes.number.isRequired,
  updateRoom: PropTypes.func.isRequired,
  updateNametagEdit: PropTypes.func.isRequired,
  setClosed: PropTypes.func.isRequired,
  closedIn: PropTypes.shape({
    unit: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired
  }),
  room: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    closedAt: PropTypes.string.isRequired
  }).isRequired,
  searchImage: PropTypes.func.isRequired,
  setImageFromUrl: PropTypes.func.isRequired,
  nametagEdits: PropTypes.object.isRequired,
  addNametagEditBadge: PropTypes.func.isRequired,
  removeNametagEditBadge: PropTypes.func.isRequired,
  me: PropTypes.shape({
    badges: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired
  }).isRequired,
  norms: PropTypes.object.isRequired,
  addNorm: PropTypes.func.isRequired,
  removeNorm: PropTypes.func.isRequired
}

export default CreateRoomForms

const styles = {
  imageSearch: {
    maxWidth: 600
  },
  userBadges: {
    width: 270,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5
  },
  userBadgeText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: grey400
  },
  editNametagContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  chooseNorms: {
    width: 350,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}
