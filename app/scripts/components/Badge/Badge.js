import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { dragTypes } from '../../constants'
import { DragSource } from 'react-dnd'
import { Card } from 'material-ui/Card'
import FontIcon from 'material-ui/FontIcon'
import ImageUpload from '../Utils/ImageUpload'
import CircularProgress from 'material-ui/CircularProgress'

const badgeSource = {
  beginDrag (props) {
    return props.badge
  },
  endDrag (props) {
    if (props.removeFromSource) {
      props.removeFromSource(props.badge.id)
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    connectDragPreview: connect.dragPreview()
  }
}

class Badge extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
    this.toggleExpanded = this.toggleExpanded.bind(this)
  }

  toggleExpanded () {
    this.setState({expanded: !this.state.expanded})
  }

  componentDidMount () {
    this.setState({expanded: this.props.expanded})
  }

  render () {
    const {
      badge: {
        id,
        notes,
        template: {
          name,
          description,
          icon,
          granter
        }
      },
      jumbo,
      connectDragSource,
      showIconUpload,
      isDragging,
      onUploadImage,
      currentOffset,
      initialOffset,
      draggable
    } = this.props

    // Show an icon if one exists, or a manu to upload an icon if showIconUpload is enabled
    let iconComponent
    if (icon) {
      iconComponent = <img style={styles.icon} alt='icon' src={icon} />
    } else if (showIconUpload) {
      iconComponent = this.state.uploading
      ? <CircularProgress />
        : <ImageUpload
          width={50}
          onChooseFile={() => this.setState({uploading: true})}
          onUploadFile={onUploadImage} />
    }

    // Show expanded or collapsed badge
    let badgeComponent
    if (this.state.expanded) {
      badgeComponent = <div key={id}>
        <Card style={styles.badgeExpanded}>
          <FontIcon
            style={styles.close}
            className='material-icons'
            onClick={this.toggleExpanded}>
                close
              </FontIcon>
          <div style={styles.cardHeader}>
            <div>
              {iconComponent}
            </div>
            <div>
              <div style={jumbo ? styles.jumboName : styles.name}>{name}</div>
              <div style={styles.granter}>Granted by {granter.name}</div>
            </div>
          </div>
          <div style={styles.description}>{description}</div>
          <div style={styles.notes}>
            {notes && notes.map((note) => {
              return <div style={styles.note} key={note.date}>
                <div style={styles.date}>{moment(note.date).format('MMMM Do, YYYY')}</div>
                <div style={styles.msg}>{': ' + note.msg}</div>
              </div>
            })}
          </div>
        </Card>
      </div>
    } else {
      let chipStyle = jumbo
        ? {...styles.badgeChip, ...styles.jumboBadgeChip}
        : styles.badgeChip
      if (isDragging && currentOffset) {
        chipStyle = Object.assign({}, chipStyle,
          {
            position: 'relative',
            top: currentOffset.y - initialOffset.y - 20,
            left: currentOffset.x - initialOffset.x
          })
      }
      const iconStyle = Object.assign({},
        styles.chipIcon,
        jumbo ? styles.jumboChipIcon : {},
        {background: `url(${icon}) 0 0 / cover`})
      badgeComponent = <div
        style={chipStyle}
        className='mdl-shadow--2dp'
        key={id}
        onClick={this.toggleExpanded}>
        {
            icon
            ? <div style={iconStyle} />
             : <div style={styles.spacer} />
          }
        <div style={styles.chipText}>{name}</div>
      </div>
    }

    // Make some badges draggable
    if (draggable) {
      badgeComponent = connectDragSource(badgeComponent)
    }
    return badgeComponent
  }
}

Badge.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  draggable: PropTypes.bool,
  badge: PropTypes.shape({
    id: PropTypes.string.isRequired,
    notes: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired
    })),
    template: PropTypes.shape({
      icon: PropTypes.string,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  isDragging: PropTypes.bool.isRequired,
  removeFromSource: PropTypes.func,
  showIconUpload: PropTypes.bool,
  onUploadImage: PropTypes.func
}

export default DragSource(dragTypes.badge, badgeSource, collect)(Badge)

const styles = {
  badgeChip: {
    height: 22,
    borderRadius: 11,
    display: 'flex',
    background: '#dedede',
    margin: 4,
    fontSize: 12,
    lineHeight: '22px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  jumboBadgeChip: {
    height: 28,
    borderRadius: 14,
    fontSize: 20,
    lineHeight: '28px'
  },
  chipIcon: {
    height: 22,
    width: 22,
    borderRadius: 11,
    marginRight: 4,
    fontSize: 12,
    verticalAlign: 'top'
  },
  jumboChipIcon: {
    height: 28,
    width: 28,
    borderRadius: 14,
    marginRight: 7
  },
  chipText: {
    display: 'flex',
    paddingRight: 10
  },
  spacer: {
    width: 10,
    height: 10,
    display: 'inline-block'
  },
  badgeExpanded: {
    margin: 5,
    marginTop: 30,
    padding: 10,
    minHeight: 100,
    borderRadius: 11,
    background: '#dedede',
    textAlign: 'left',
    maxWidth: 300
  },
  cardHeader: {
    display: 'flex',
    flexBasis: 'auto'
  },
  close: {
    fontSize: 18,
    float: 'right',
    padding: 10,
    cursor: 'pointer'
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 3
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  jumboName: {
    fontSize: 22
  },
  granter: {
    fontSize: 12
  },
  description: {
    textAlign: 'left'
  },
  note: {
    fontSize: 12
  },
  date: {
    fontStyle: 'italic',
    float: 'left'
  }
}
