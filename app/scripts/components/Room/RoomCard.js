import React, { Component, PropTypes } from 'react'
import Nametag from '../Nametag/Nametag'
import Norms from './Norms'
import Join from './Join'
import constants from '../../constants'
import {Card, CardTitle, CardMedia} from 'material-ui/Card'
import Checkbox from 'material-ui/Checkbox'
import {grey400} from 'material-ui/styles/colors'
import TimeAgo from 'react-timeago'
import Badges from '../Badge/Badges'

class RoomCard extends Component {

  constructor (props) {
    super(props)

    this.state = {
      flipped: false,
      flipping: false,
      normsChecked: false
    }

    this.onNormsCheck = (e) => {
      this.setState({normsChecked: e.target.checked})
    }

    this.flip = () => {
      this.setState({flipped: !this.state.flipped, flipping: 0.01})

      // Run the flipping animation. This needs to be done w/ JS b/c Radium doesn't support it.
      let counter = 0
      let anim = setInterval(() => {
        counter += 20
        let complete = counter / constants.ANIMATION_LONG
        if (complete >= 1) {
          this.setState({flipping: false})
          clearInterval(anim)
        } else {
          this.setState({flipping: complete})
        }
      }, 20)
    }
  }

  componentWillUpdate (nextProps) {
    if (nextProps.flipped !== this.props.flipped &&
      nextProps.flipped !== this.state.flipped) {
      this.flip()
    }
  }

  render () {
    const {
      room,
      creating,
      style,
      me,
      nametagEdits,
      addNametagEditBadge,
      removeNametagEditBadge,
      updateNametagEdit,
      createNametag
    } = this.props
    let card
    let flipping = {}

    let front = <Card key='front' style={styles.front}>
      {
        room.image
        ? <CardMedia
          onClick={this.flip}>
          <img
            style={styles.roomImage}
            src={room.image} />
        </CardMedia>
        : null
      }
      <div style={styles.roomInfo}>
        <div style={styles.greyText}>
          Ends <TimeAgo date={new Date(room.closedAt)} />
        </div>
        <Badges
          badges={room.templates.map(template => ({id: template.id, notes: [], template}))} />
        <CardTitle
          title={room.title}
          style={styles.roomName}
          onClick={this.flip} />
        <div style={styles.roomDescription}>{room.description}</div>
        <p style={styles.greyText}>
          {room.nametagCount || 0} participant
            {room.nametagCount === 1 ? '' : 's'}
        </p>
      </div>
      {
        !creating || room.mod.name
        ? <Nametag
          style={styles.mod}
          mod={room.mod.id}
          nametag={room.mod} />
        : null
      }
    </Card>

    let backStyle = this.state.flipping
    ? {...styles.back, ...styles.backWhileFlipping} : styles.back
    let back = <Card key='back' style={backStyle}>
      <CardTitle
        style={styles.roomNameBack}
        onClick={this.flip}
        title={room.title} />
      <div style={styles.norms}>
        <h4>Conversation Norms</h4>
        <Norms norms={room.norms} showChecks />
        {
          me &&
          <Checkbox
            style={styles.checkbox}
            label='I agree to these norms'
            onClick={this.onNormsCheck} />
        }
      </div>
      {
        !creating &&
        <Join
          room={room.id}
          nametag={nametagEdits[room.id]}
          me={me}
          createNametag={createNametag}
          normsChecked={this.state.normsChecked}
          addNametagEditBadge={addNametagEditBadge}
          removeNametagEditBadge={removeNametagEditBadge}
          updateNametagEdit={updateNametagEdit}
          />
      }
    </Card>

    // Show both front and back only if the card is flipping
    // Otherwise only show the active part of the card.
    // This is to prevent errors in some browsers (like Chrome.)

    if (this.state.flipping) {
      card = [front, back]
      let rotation = this.state.flipped ? this.state.flipping * 180 : this.state.flipping * 180 + 180
      let flipType = this.state.flipped ? styles.flippingFront : styles.flippingBack
      flipping = Object.assign({}, flipType, {transform: 'rotateY(' + rotation + 'deg)'})
    } else {
      card = this.state.flipped ? back : front
    }

    return <div style={{...styles.roomCard, ...flipping, ...style}}>
      {card}
    </div>
  }
}

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    closedAt: PropTypes.string.isRequired
  }).isRequired,
  style: PropTypes.object,
  me: PropTypes.shape({
    id: PropTypes.string.isRequired,
    badges: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  nametagEdits: PropTypes.object.isRequired,
  addNametagEditBadge: PropTypes.func.isRequired,
  removeNametagEditBadge: PropTypes.func.isRequired,
  updateNametagEdit: PropTypes.func.isRequired,
  createNametag: PropTypes.func,
  creating: PropTypes.bool
}

export default RoomCard

const styles = {
  roomImage: {
    borderRadius: '2px 2px 0px 0px',
    cursor: 'pointer',
    width: 300,
    height: 200,
    objectFit: 'cover'
  },
  roomCard: {
    margin: 30,
    paddingBottom: 30,
    width: 300,
    backfaceVisibility: 'hidden',
    verticalAlign: 'top',
    perspective: 1000
  },
  roomName: {
    cursor: 'pointer',
    minHeight: 72
  },
  roomNameBack: {
    cursor: 'pointer',
    paddingBottom: 0
  },
  roomDescription: {
    minHeight: 64
  },
  flippingFront: {
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d'
  },
  flippingBack: {
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d'
  },
  front: {
    zIndex: 2,
    width: 300,
    background: '#fff'
  },
  back: {
    padding: '0px 20px 20px 20px',
    textAlign: 'center',
    width: 300,
    zIndex: 0,
    background: '#fff',
    transition: 'none'
  },
  backWhileFlipping: {
    transform: 'rotateY(-180deg)',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    top: 0,
    left: 0
  },
  roomInfo: {
    padding: 10
  },
  greyText: {
    textAlign: 'right',
    fontSize: 11,
    fontStyle: 'italic',
    color: grey400
  },
  ismod: {
    marginBottom: 5
  },
  modTitle: {
    marginLeft: 5,
    fontWeight: 'bold',
    display: 'inline-block'
  },
  image: {
    float: 'left',
    paddingRight: 10
  },
  checkbox: {
    textAlign: 'left'
  }
}
