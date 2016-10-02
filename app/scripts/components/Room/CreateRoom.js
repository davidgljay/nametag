import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ImageSearch from './ImageSearch'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import TitleForm from './TitleForm'
import EditNametag from '../Nametag/EditNametag'
import UserCertificates from '../Certificate/UserCertificates'
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500, grey400} from 'material-ui/styles/colors'

class CreateRoom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      room: {},
      hostNametag: {
        certificates: [],
      },
      image: '',
      norms: [],
      newRoom: false,
      finsihed: false,
      stepIndex: 0,
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.updateRoom = this.updateRoom.bind(this)
    this.updateNametag = this.updateNametag.bind(this)
    this.addNametagCert = this.addNametagCert.bind(this)
    this.removeNametagCert = this.removeNametagCert.bind(this)
    this.updateRoom = this.updateRoom.bind(this)
  }

  handleNext() {
    this.setState((prevState) => {
      prevState.stepIndex ++
      prevState.finished = prevState.stepIndex >= 3
      return prevState
    })
  }

  handlePrev() {
    this.setState((prevState) => {
      if (prevState.stepIndex > 0) {
        prevState.stepIndex --
      }
      return prevState
    })
  }

  updateNametag(room, prop, val) {
    this.setState({hostNametag: {[prop]: val}})
  }

  addNametagCert(cert) {
    this.setState((prevState) => {
      prevState.hostNametag.certificates.push(cert)
      return prevState
    })
  }

  removeNametagCert(certId) {
    this.setState((prevState) => {
      let certs = prevState.hostNametag.certificates
      for (let i = 0; i < certs.length; i++) {
        if (certs[i].id === certId) {
          certs = certs.slice(0, i).concat(certs.slice(i + 1, certs.length))
        }
      }
      return prevState
    })
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
    case 0:
      return <div>
        <h4>What would you like to talk about?</h4>
        <TitleForm
          updateRoom={this.updateRoom}
          title={this.state.room.title}
          desc={this.state.room.description}/>
      </div>
    case 1:
      return <div>
        <h4>Please select an image for your room.</h4>
        <ImageSearch
          style={styles.imageSearch}
          searchImage={this.props.searchImage}
          setImageQuery={(e) => this.setState({imageQuery: e.target.value})}
          updateRoom={this.updateRoom}
          imageQuery={this.state.imageQuery}/>
      </div>
    case 2:
      return <div>
        <h4>How would you like to appear in your room?</h4>
        <div style={styles.editNametagContainer}>
          <div>
            <EditNametag
              userNametag={this.state.hostNametag}
              addUserNametagCert={this.addNametagCert}
              removeUserNametagCert={this.removeNametagCert}
              updateUserNametag={this.updateNametag}
              room=''/>
            <div style={styles.userCertificates}>
              <p style={styles.userCertificateText}>
                Click to view your certificates.<br/>
                Drag them over to show them in this conversation.
              </p>
              <UserCertificates
                fetchCertificate={this.props.fetchCertificate}
                selectedCerts={this.state.hostNametag.certificates}/>
            </div>
          </div>
        </div>
      </div>
    case 3:
      return <div>
        <h4>Please set norms for this discussion.</h4>
        <NormForm/>
      </div>
    default:
      return 'Something has gone wrong!'
    }
  }

  updateRoom(prop, val) {
    this.setState((prevState) => {
      prevState.room[prop] = val
      return prevState
    })
  }

  render() {
    const {user, logout} = this.props
    const {room, stepIndex, desc, finished} = this.state
    const orientation = window.innerWidth < 650 ? 'vertical' : 'horizontal'
    return <div >
      <Navbar user={user} logout={logout}/>
      <Stepper activeStep={stepIndex} orientation={orientation}>
          <Step>
            <StepLabel>Choose a topic</StepLabel>
          </Step>
          <Step>
            <StepLabel>Find an image</StepLabel>
          </Step>
          <Step>
            <StepLabel>Build your nametag</StepLabel>
          </Step>
          <Step>
            <StepLabel>Set the norms</StepLabel>
          </Step>
        </Stepper>
        <div style={styles.roomPreview}>
          <RoomCard
            room={room}
            id={'new'}
            style={styles.previewCard}
            creating={true}/>
        </div>
        {
          finished ?
          <h4>Publish this room?</h4>
          : <div style={styles.createRoom}>
              <h3>{desc}</h3>
              {
                this.getStepContent(stepIndex)
              }
              <div>
                {
                  this.state.stepIndex > 0 &&
                  <RaisedButton
                    style={styles.button}
                    backgroundColor={indigo500}
                    onClick={this.handlePrev}>
                    PREV
                  </RaisedButton>
                }
                <RaisedButton
                  style={styles.button}
                  backgroundColor={indigo500}
                  onClick={this.handleNext}>
                  NEXT
                </RaisedButton>
              </div>

            </div>
        }
    </div>
  }
}

CreateRoom.propTypes = {
  searchImage: PropTypes.func.isRequired,
  addUserNametag: PropTypes.func.isRequired,
  watchNametag: PropTypes.func.isRequired,
  unWatchNametag: PropTypes.func.isRequired,
  setRoomProp: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  fetchCertificate: PropTypes.func.isRequired,
}

export default CreateRoom

const styles = {
  createRoom: {
    textAlign: 'center',
  },
  roomPreview: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'left',
  },
  previewCard: {
    margin: 0,
  },
  button: {
    color: '#fff',
    margin: 20,
  },
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
}
