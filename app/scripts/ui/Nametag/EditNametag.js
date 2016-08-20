import React, { Component, PropTypes } from 'react'
import Alert from '../Utils/Alert'
import Certificate from '../Certificate/Certificate'
import { DropTarget } from 'react-dnd'
import { dragTypes } from '../../constants'
import {addNametagCert, removeNametagCert, updateNametag} from '../../actions/RoomActions'
import style from '../../../styles/Nametag/EditNametag.css'

const nametagTarget = {
  drop(props, monitor) {
    props.dispatch(addNametagCert(monitor.getItem(), props.roomId))
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}

class EditNametag extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: null,
      alertType: null,
    }
  }

  updateNametagProperty(property) {
    return (e) => {
      this.props.dispatch(updateNametag(
        this.props.roomId,
        property,
        e.target.value
        )
      )
    }
  }

  removeCert(cert) {
    props.dispatch(removeNametagCert(cert.id, this.props.roomId))
  }

  render() {
    let nametag = this.props.userNametag || {name: '', bio: '', roomId: this.props.roomId}
    // TODO: Figure out image caching
    return this.props.connectDropTarget(<div id={style.editNametag} className="profile">
          <div className={style.form}>
            <img
              src="https://s3.amazonaws.com/badgeproject_icons/users/dj_cropped.jpg"
              className={style.icon}/>
            <div className={style.nametagFields}>
                <input
                  type="text"
                  className={style.formControl + ' ' + style.name}
                  id={style.participantName}
                  onChange={this.updateNametagProperty('name').bind(this)}
                  value={nametag.name}
                  placeholder='Name'/>
                <textarea
                  rows="2"
                  className={style.formControl + ' ' + style.bio}
                  id={style.participantDescription}
                  onChange={this.updateNametagProperty('bio').bind(this)}
                  value={nametag.bio}
                  placeholder='Why are you joining this conversation?'/>
            </div>
            <div className="certificates">
              {nametag.certificates && nametag.certificates.map(
                function mapCertificates(cert) {
                  return <Certificate
                    certificate={cert}
                    draggable={true}
                    removeFromSource={this.removeCert.bind(this)}
                    key={cert.id} />
                }, this)}
            </div>
          </div>
        </div>)
  }
}

EditNametag.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userNametag: PropTypes.object,
  roomId: PropTypes.string.isRequired,
  isOver: PropTypes.bool.isRequired,
}

export default DropTarget(dragTypes.certificate, nametagTarget, collect)(EditNametag)
