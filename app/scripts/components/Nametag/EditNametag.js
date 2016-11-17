import React, { Component, PropTypes } from 'react'
import Alert from '../Utils/Alert'
import Certificate from '../Certificate/Certificate'
import { DropTarget } from 'react-dnd'
import { dragTypes } from '../../constants'
import {Card} from 'material-ui/Card'
import TextField from 'material-ui/TextField'

const styles = {
  editNametag: {
    width: 250,
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5,
  },
  cardInfo: {
    display: 'flex',
  },
  icon: {
    borderRadius: 25,
    width: 50,
    height: 50,
    margin: 5,
  },
}

const nametagTarget = {
  drop(props, monitor) {
    props.addUserNametagCert(monitor.getItem(), props.room)
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({shallow: true}),
  }
}

class EditNametag extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: null,
      alertType: null,
    }
    this.removeCert = this.removeCert.bind(this)
    this.updateNametagProperty = this.updateNametagProperty.bind(this)
  }

  componentDidMount() {
    this.props.updateUserNametag(
        this.props.room,
        'room',
        this.props.room
        )
  }

  updateNametagProperty(property) {
    return (e) => {
      this.props.updateUserNametag(
        this.props.room,
        property,
        e.target.value
        )
    }
  }

  removeCert(cert) {
    this.props.removeUserNametagCert(cert, this.props.room)
  }

  render() {
    let nametag = this.props.userNametag || {name: '', bio: ''}
    // TODO: Figure out image caching
    return this.props.connectDropTarget(<div>
          <Card style={styles.editNametag} className="profile">
            <div style={styles.cardInfo}>
              <img
                src="https://s3.amazonaws.com/badgeproject_icons/users/dj_cropped.jpg"
                style={styles.icon}/>
              <div style={{width: 190, flex:1}}>
                  <TextField
                    style={{marginLeft: 10, width: 160, height: 50}}
                    inputStyle={{height: 50, margin: 0}}
                    floatingLabelStyle={{top: 20}}
                    underlineShow={false}
                    errorText={this.props.error && this.props.error.nameError}
                    onChange={this.updateNametagProperty('name')}
                    value={nametag.name}
                    hintText='Name'/>
                  <TextField
                    style={{width: 160}}
                    rows={2}
                    multiLine={true}
                    fullWidth={true}
                    errorText={this.props.error && this.props.error.bioError}
                    underlineShow={false}
                    onChange={this.updateNametagProperty('bio')}
                    value={nametag.bio}
                    hintText='What brings you to this conversation?'/>
              </div>
            </div>
            <div className="certificates">
              {nametag.certificates && nametag.certificates.map(
                (cert) =>
                  <Certificate
                    certificate={cert}
                    draggable={true}
                    removeFromSource={this.removeCert}
                    key={cert.id} />
                )}
            </div>
          </Card>
        </div>)
  }
}

EditNametag.propTyes = {
  dispatch: PropTypes.func.isRequired,
  userNametag: PropTypes.object,
  room: PropTypes.string.isRequired,
  isOver: PropTypes.bool.isRequired,
}

export default DropTarget(dragTypes.certificate, nametagTarget, collect)(EditNametag)
