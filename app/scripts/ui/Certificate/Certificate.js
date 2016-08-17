import React, { Component, PropTypes } from 'react'
import moment from '../../../bower_components/moment/moment'
import { dragTypes } from '../../constants'
import { DragSource } from 'react-dnd'
import style from '../../../styles/Certificate/Certificate.css'

// TODO: This currently displays all user certificates, as opposed to only the participant certificates. A major violation of trust!

const certSource = {
  beginDrag(props) {
    return props.certificate
  },
  endDrag(props) {
    // TODO: fix drag animation to intuitively communicate badge removal
    if (props.removeFromSource) {
      props.removeFromSource(props.certificate.id)
    }
  },
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  }
}

class Certificate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    if (!this.props.name) {
      return null
    }
    let certificate
    let icon = ''
    if (this.props.icon_array) {
      icon = <img className={style.icon} alt="icon" src={this.props.icon_array[0]}/>
    }
    if (this.state.expanded) {
      certificate = <div className={style.certificateExpanded}>
      <span className={style.close + ' glyphicon glyphicon-remove'} onClick={this.toggleExpanded.bind(this)} aria-hidden="true"/>
            { icon }
            <div className={style.name}>{this.props.name}</div>
            <div className={style.granter}>Verified by: {this.props.granter}</div>
            <div className={style.description}>{this.props.description_array[0]}</div>
            <hr/>
            <div className={style.notes}>
              {this.props.notes.map(function mapNotes(note) {
                 return <div className={style.note} key={note.date}>
                    <div className={style.date}>{moment(note.date).format('MMMM Do, YYYY')}: </div>
                    <div className={style.msg}>{note.msg}</div>
                  </div>
              })}
            </div>
          </div>
    } else {
      certificate = <div
        className={style.certificate}
        onClick={this.toggleExpanded.bind(this)}>
          {this.props.name}
        </div>
    }

    //Make some certificates draggable
    if (this.props.draggable) {
      certificate = this.props.connectDragSource(certificate)
    }
    return certificate
  }
}

Certificate.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  draggable: PropTypes.bool.isRequired,
  certificate: PropTypes.object,
  isDragging: PropTypes.bool.isRequired,
  removeFromSource: PropTypes.func,
}

export default DragSource(dragTypes.certificate, certSource, collect)(Certificate)
