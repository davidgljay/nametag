import React, { Component, PropTypes } from 'react'
import NametagContainer from '../../containers/Nametag/NametagContainer'
import Nametag from '../Nametag/Nametag'
import Norms from '../Room/Norms'
import Join from '../../containers/Room/JoinContainer'
import constants from '../../constants'
import {Card, CardTitle, CardMedia} from 'material-ui/Card'
import Checkbox from 'material-ui/Checkbox'
import {grey400} from 'material-ui/styles/colors'
import trackEvent from '../../utils/analytics'
import TimeAgo from 'react-timeago'

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
      trackEvent('CARD_FLIP')
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
      hostNametag,
      creating,
      style,
      nametag,
      addNametagEditCert,
      updateUserNametag,
      providerAuth,
      removeNametagEditCert,
      id
    } = this.props
    let card
    let flipping = {}

    let front = <Card key='front' style={styles.front}>
      {
        this.props.room.image &&
        <CardMedia
          onClick={this.flip}>
          <img
            style={styles.roomImage}
            src={room.image} />
        </CardMedia>
      }
      <div style={styles.roomInfo}>
        <div style={styles.greyText}>
          Ends <TimeAgo date={new Date(room.closedAt)} />
        </div>
        <CardTitle
          title={room.title}
          style={styles.roomName}
          onClick={this.flip} />
        {room.description}<br />
        <p style={styles.greyText}>
          {room.nametagCount || 0} participant
            {room.nametagCount === 1 ? '' : 's'}
        </p>
      </div>
      {
        room.mod &&
        <NametagContainer
          style={styles.mod}
          room={id}
          id={room.mod}
          mod={room.mod} />
      }
      {
        creating &&
        (hostNametag.name || hostNametag.bio) &&
        <Nametag
          style={styles.mod}
          id='1'
          mod='1'
          watchNametag={() => {}}
          unWatchNametag={() => {}}
          {...hostNametag} />
      }
    </Card>

    let backStyle = this.state.flipping
    ? {...styles.back, ...styles.backWhileFlipping} : styles.back
    let back = <Card key='back' style={backStyle}>
      <CardTitle
        style={styles.roomName}
        onClick={this.flip}
        title={room.title} />
      <div style={styles.norms}>
        <h4>Conversation Norms</h4>
        <Norms norms={room.norms} showChecks />
        <Checkbox
          style={styles.checkbox}
          label='I agree to these norms'
          onClick={this.onNormsCheck} />
      </div>
      {
        !creating &&
        <Join
          room={id}
          nametag={nametag}
          normsChecked={this.state.normsChecked}
          addNametagEditCert={addNametagEditCert}
          removeNametagEditCert={removeNametagEditCert}
          updateUserNametag={updateUserNametag}
          providerAuth={providerAuth} />
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
  room: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  creating: PropTypes.bool,
  userNametag: PropTypes.object
}

RoomCard.contextTypes = {
  user: PropTypes.object
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
    cursor: 'pointer'
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
  icon: {
    float: 'left',
    paddingRight: 10
  },
  checkbox: {
    textAlign: 'left'
  }
}
