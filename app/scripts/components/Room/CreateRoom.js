import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ImageSearch from './ImageSearch'
import RoomCard from './RoomCard'
import Navbar from '../Utils/Navbar'
import TitleForm from './TitleForm'
import EditNametag from '../Nametag/EditNametag'
import UserCertificates from '../Certificate/UserCertificates'
import ChooseNorms from './Create/ChooseNorms'
import Stepper from './Create/Stepper'
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
      norms: {},
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
    this.addNorm = this.addNorm.bind(this)
    this.removeNorm = this.removeNorm.bind(this)
    this.postRoom = this.postRoom.bind(this)
  }

  static propTypes = {
    searchImage: PropTypes.func.isRequired,
    postRoom: PropTypes.func.isRequired,
    addUserNametag: PropTypes.func.isRequired,
    watchNametag: PropTypes.func.isRequired,
    unWatchNametag: PropTypes.func.isRequired,
    setRoomProp: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    fetchCertificate: PropTypes.func.isRequired,
  }

  handleNext() {
    this.setState((prevState) => {
      prevState.stepIndex ++
      prevState.finished = prevState.stepIndex > 3
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
    this.setState((prevState) => {
      prevState.hostNametag[prop] = val
      return prevState
    })
  }

  addNametagCert(cert) {
    this.setState((prevState) => {
      prevState.hostNametag.certificates.push(cert)
      return prevState
    })
  }

  addNorm(norm, key) {
    this.setState((prev) => {
      prev.norms[key] = norm
      prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
      return prev
    })
  }

  removeNorm(key) {
    this.setState((prev) => {
      delete prev.norms[key]
      prev.room.norms = Object.keys(prev.norms).map((k) => prev.norms[k])
      return prev
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

  postRoom() {
    this.props.postRoom(this.state.room)
      .then((roomId) => {
        this.props.addUserNametag(roomId, this.state.hostNametag)
      })
      .then(() => {
        window.location = '/#/'
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
        <ChooseNorms
          style={styles.chooseNorms}
          addNorm={this.addNorm}
          normsObj={this.state.norms}
          removeNorm={this.removeNorm}/>
      </div>
    case 4:
      return <div>
            <h4>Ready to publish this conversation?</h4>
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
    const {room, stepIndex} = this.state
    return <div>
      <Navbar user={user} logout={logout}/>
        <div style={styles.title}>
          <h1>Start a Conversation</h1>
          <Stepper stepIndex={stepIndex}/>
        </div>
        <div style={styles.roomPreview}>
          <RoomCard
            room={room}
            id={'new'}
            style={styles.previewCard}
            creating={true}
            hostNametag={this.state.hostNametag}/>
        </div>
        <div style={styles.createRoom}>
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
                BACK
              </RaisedButton>
            }
            {
              this.state.stepIndex >= 4 ?
              <RaisedButton
                style={styles.button}
                backgroundColor={indigo500}
                onClick={this.postRoom}>
                PUBLISH
              </RaisedButton>
              : <RaisedButton
                style={styles.button}
                backgroundColor={indigo500}
                onClick={this.handleNext}>
                NEXT
              </RaisedButton>
            }

        </div>

        </div>
    </div>
  }
}

export default CreateRoom

const styles = {
  createRoom: {
    textAlign: 'center',
  },
  title: {
    margin: 40,
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
  chooseNorms: {
    width: 350,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}
