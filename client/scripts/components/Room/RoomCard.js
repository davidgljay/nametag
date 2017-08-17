import React, { Component, PropTypes } from 'react'
import Nametag from '../Nametag/Nametag'
import Norms from './Norms'
import Join from './Join'
import constants from '../../constants'
import {Card, CardTitle, CardMedia} from 'material-ui/Card'
import {grey} from '../../../styles/colors'
import {track} from '../../utils/analytics'
import Badges from '../Badge/Badges'

class RoomCard extends Component {

  constructor (props) {
    super(props)

    this.state = {
      flipped: false,
      flipping: false
    }

    this.flip = () => {
      track('FLIP_CARD', {id: this.props.room.id, title: this.props.room.title})
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

    let front = <Card key='front' style={styles.front} className='roomCard'>
      {
        room.image
        ? <CardMedia
          id='roomImage'>
          <img
            style={styles.roomImage}
            onClick={this.flip}
            src={room.image} />
        </CardMedia>
        : null
      }
      <div style={styles.roomInfo}>
        <div style={styles.greyText} onClick={this.flip}>
          Click to Join
        </div>
        {
          room.templates && room.templates.length > 0 &&
          <div style={styles.privateText}>Conversation Requires:</div>
        }
        <Badges
          badges={room.templates.map(template => ({id: template.id, notes: [], template}))} />
        <CardTitle
          onClick={this.flip}
          title={room.title}
          style={styles.roomName} />
        <div
          onClick={this.flip}
          style={styles.roomDescription}>
          {room.description}
        </div>
        <p style={styles.greyText}>
          {room.nametagCount || 0} participant
            {room.nametagCount === 1 ? '' : 's'}
        </p>
      </div>
      {
        !creating || room.mod.name
        ? <Nametag
          style={styles.mod}
          modId={room.mod.id}
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
        <div style={styles.normsTitle}>
          {room.mod.name} would like you to agree to these norms before joining:
        </div>
        <Norms norms={room.norms} showChecks />
      </div>
      {
        !creating &&
        <Join
          room={room.id}
          nametag={nametagEdits[room.id]}
          me={me}
          templates={room.templates.map(t => t.id)}
          createNametag={createNametag}
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

    return <div
      data-id={room.id}
      className={`roomCard ${this.state.flipping ? 'flipping' : 'notFlipping'}`}
      style={{...styles.roomCard, ...flipping, ...style}}>
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
  norms: {
    paddingTop: 10,
    paddingBottom: 20
  },
  normsTitle: {
    display: 'flex',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    margin: 5
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
    color: grey,
    cursor: 'pointer'
  },
  privateText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    color: grey,
    marginTop: 10
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
  button: {
    color: '#fff',
    fontWeight: 'bold'
  }
}
