import React, { Component, PropTypes } from 'react'
import moment from '../../../bower_components/moment/moment'
import { dragTypes } from '../../constants'
import { DragSource } from 'react-dnd'
import { Card, Icon, CardMenu } from 'react-mdl'

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
    this.toggleExpanded = this.toggleExpanded.bind(this)
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    if (!this.props.certificate) {
      return null
    }
    let certificate
    if (this.state.expanded) {
      certificate = <div>
        <Card shadow={1} style={styles.certificateExpanded}>
            <CardMenu style={styles.closeMenu}>
              <Icon name="close" style={styles.close} onClick={this.toggleExpanded}/>
            </CardMenu>
            <div style={styles.cardHeader}>
              <div>
                {
                  this.props.certificate.icon_array &&
                  <img style={styles.icon} alt="icon" src={this.props.certificate.icon_array[0]}/>
                }
              </div>
              <div>
                <div style={styles.name}>{this.props.certificate.name}</div>
                <div style={styles.granter}><em>Verified by: </em><br/>{this.props.certificate.granter}</div>
              </div>
            </div>
            <div style={styles.description}>{this.props.certificate.description_array[0]}</div>
            <hr/>
            <div style={styles.notes}>
              {this.props.certificate.notes.map(function mapNotes(note) {
                 return <div style={styles.note} key={note.date}>
                    <div style={styles.date}>{moment(note.date).format('MMMM Do, YYYY')}</div>
                    <div style={styles.msg}>{': ' + note.msg}</div>
                  </div>
              })}
            </div>
          </Card>
        </div>
    } else {
      certificate = <div
        style={styles.certificateChip}
        className="mdl-shadow--2dp"
        onClick={this.toggleExpanded}>
        {
          this.props.certificate.icon_array ?
           <div style={Object.assign({}, styles.miniIcon, {background: 'url(' + this.props.certificate.icon_array[0] + ') 0 0 / cover'})}/>
           : <div style={styles.spacer}/>
        }
         <div style={styles.chipText}>{this.props.certificate.name}</div>
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

const styles = {
  certificateChip: {
    height: 22,
    borderRadius: 11,
    display: 'inline-block',
    background: '#dedede',
    margin: 8,
    fontSize: 12,
    lineHeight: '22px',
    cursor: 'pointer',
  },
  miniIcon: {
    height: 22,
    width: 22,
    borderRadius: 11,
    marginRight: 4,
    fontSize: 12,
    display: 'inline-block',
    lineHeight: '22px',
    verticalAlign: 'top',
  },
  chipText: {
    display: 'inline-block',
    paddingRight: 10,
  },
  spacer: {
    width: 10,
    height: 10,
    display: 'inline-block',
  },
  certificate: {
    marginLeft: 5,
    marginBottom: 5,
    cursor: 'pointer',
    display: 'inline-block',
    userSelect: 'none',
    textAlign: 'left',
  },
  certificateExpanded: {
    margin: 5,
    marginTop: 30,
    padding: 10,
    width: '96%',
    minHeight: 100,
    borderRadius: 11,
    background: '#dedede',
  },
  closeMenu: {
    top: 10,
    right: 10,
  },
  cardHeader: {
    display: 'flex',
    flexBasis: 'auto',
  },
  close: {
    fontSize: 18,
    cursor: 'pointer',
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  granter: {
    fontSize: 12,
  },
  description: {
    textAlign: 'left',
  },
  note: {
    fontSize: 12,
  },
  date: {
    fontStyle: 'italic',
    float: 'left',
  },
}
