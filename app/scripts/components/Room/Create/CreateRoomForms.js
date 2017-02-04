import React from 'react'
import TitleForm from './TitleForm'
import EditNametag from '../../Nametag/EditNametag'
import UserCertificates from '../../Certificate/UserCertificates'
import ChooseNorms from './ChooseNorms'
import ImageSearch from './ImageSearch'
import {grey400} from 'material-ui/styles/colors'

const getForm = (props) => {
  switch (props.stepIndex) {
  case 0:
    return <div>
      <h4>What would you like to talk about?</h4>
      <TitleForm
        error={props.error}
        updateRoom={props.updateRoom}
        setClosed={props.setClosed}
        closedIn={props.closedIn}
        title={props.room.title}
        desc={props.room.description}/>
    </div>
  case 1:
    return <div>
      <h4>Please select an image for this conversation.</h4>
      <ImageSearch
        error={props.error}
        style={styles.imageSearch}
        setImageFromUrl={props.setImageFromUrl}
        searchImage={props.searchImage}
        updateRoom={props.updateRoom}/>
    </div>
  case 2:
    return <div>
      <h4>How would you like to appear in your room?</h4>
      <div style={styles.editNametagContainer}>
        <div>
          <EditNametag
            error={props.error}
            userNametag={props.hostNametag}
            addNametagEditCert={props.addNametagCert}
            removeNametagEditCert={props.removeNametagCert}
            updateNametagEdit={props.updateNametag}
            userDefaults={props.user.data}
            room=''/>
          <div style={styles.userCertificates}>
            <p style={styles.userCertificateText}>
              Click to view your certificates.<br/>
              Drag them over to show them in this conversation.
            </p>
            <UserCertificates
              fetchCertificate={props.fetchCertificate}
              selectedCerts={props.hostNametag.certificates}/>
          </div>
        </div>
      </div>
    </div>
  case 3:
    return <div>
      <h4>Please set norms for this discussion.</h4>
      <ChooseNorms
        error={props.error}
        style={styles.chooseNorms}
        addNorm={props.addNorm}
        normsObj={props.norms}
        removeNorm={props.removeNorm}/>
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

export default CreateRoomForms

const styles = {
  imageSearch: {
    maxWidth: 600,
  },
  userCertificates: {
    width: 270,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5,
  },
  userCertificateText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: grey400,
  },
  editNametagContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  chooseNorms: {
    width: 350,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}
