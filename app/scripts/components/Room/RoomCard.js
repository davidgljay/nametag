import React, { Component, PropTypes } from 'react'
import Nametag from '../../containers/Nametag/NametagContainer'
import Norms from '../Room/Norms'
import Join from './Join'
import constants from '../../constants'
import {mobile} from '../../../styles/sizes'
import {Card, CardTitle, CardMedia} from 'material-ui/Card'
import {grey400} from 'material-ui/styles/colors'

const styles = {
  roomImage: {
    borderRadius: '2px 2px 0px 0px',
    cursor: 'pointer',
    width: 300,
    height: 200,
  },
  roomCard: {
    margin: 30,
    paddingBottom: 30,
    width: 300,
    backfaceVisibility: 'hidden',
    verticalAlign: 'top',
    perspective: 1000,
  },
  flippingFront: {
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
  },
  flippingBack: {
    backfaceVisibility: 'hidden',
    transformStyle: 'preserve-3d',
  },
  front: {
    zIndex: 2,
    width: 300,
    background: '#fff',
  },
  back: {
    padding: '0px 20px 20px 20px',
    textAlign: 'center',
    width: 300,
    zIndex: 0,
    background: '#fff',
    transition: 'none',
  },
  backWhileFlipping: {
    transform: 'rotateY(-180deg)',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    top: 0,
    left: 0,
  },
  roomInfo: {
    padding: 10,
  },
  greyText: {
    textAlign: 'right',
    fontSize: 11,
    fontStyle: 'italic',
    color: grey400,
  },
  ismod: {
    marginBottom: 5,
  },
  modTitle: {
    marginLeft: 5,
    fontWeight: 'bold',
    display: 'inline-block',
  },
  icon: {
    float: 'left',
    paddingRight: 10,
  },
}

class RoomCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flipped: false,
      flipping: false,
      normsChecked: false,
      checkingForNametag: false,
    }
    this.flip = this.flip.bind(this)
    this.onNormsCheck = this.onNormsCheck.bind(this)
    this.checkForNametag = this.checkForNametag.bind(this)
  }

  componentDidMount() {
    this.checkForNametag()
  }

  componentWillUpdate() {
    this.checkForNametag()
  }

  checkForNametag() {
    if ( this.context.user &&
      this.context.user.id &&
      !this.props.userNametag &&
      !this.state.checkingForNametag) {
      this.setState({checkingForNametag: true})
      this.props.getUserNametag(this.props.id, this.context.user.id)
        .then((userNametag) => {
          this.setState({checkingForNametag: false})
          if (!userNametag) {
            return {room: this.props.id}
          }
          return this.props.watchNametag(userNametag)
        })
        .then((nametag) => {
          return this.props.addUserNametag(this.props.id, nametag)
        })
        .catch((err) => {console.log('Error checking for nametag: ' + err)})
    }
  }

  onNormsCheck(e) {
    this.setState({normsChecked: e.target.checked})
  }

  flip() {
    this.setState({flipped: !this.state.flipped, flipping: 0.001})

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

  render() {
    let card
    let flipping = {}

    let front =  <Card key='front' style={styles.front}>
          <CardMedia
            onClick={this.flip}>
            <img
            style={styles.roomImage}
            src={this.props.room.image}/>
          </CardMedia>
          <div style={styles.roomInfo}>
            <div style={styles.roomTime}>
              <b>Started</b> 2 days ago | <b>Ends</b> in 1 week
            </div>
            <CardTitle
              title={this.props.room.title}
              onClick={this.flip.bind(this)}/>
              {this.props.room.description}<br/>
              {
                this.props.room.nametagCount &&
                <p style={styles.nametagCount}>
                  {this.props.room.nametagCount} participant
                  {this.props.room.nametagCount === 1 ? '' : 's'}
                </p>
              }

            </div>
            <hr></hr>
            <Nametag
              style={styles.mod}
              room={this.props.id}
              id={this.props.room.mod}
              mod={this.props.room.mod} />
        </Card>

    let backStyle = this.state.flipping ? { ...styles.back, ...styles.backWhileFlipping} : styles.back
    let back = <Card key='back' style={backStyle}>
          <h3 onClick={this.flip.bind(this)}>{this.props.room.title}</h3>
          <div style={styles.norms}>
            <h4>Conversation Norms</h4>
            <Norms norms={this.props.room.norms} showChecks={true}/>
            <label>
              <input type="checkbox" onClick={this.onNormsCheck}/>
              <span>I agree to abide by these norms</span>
            </label>
          </div>
          <Join
            room={this.props.id}
            userNametag={this.props.userNametag}
            normsChecked={this.state.normsChecked}/>
        </Card>

    //Show both front and back only if the card is flipping
    //Otherwise only show the active part of the card.
    //This is to prevent errors in some browsers (like Chrome.)

    if (this.state.flipping) {
      card = [front, back]
      let rotation = this.state.flipped ? this.state.flipping * 180 : this.state.flipping * 180 + 180
      let flipType = this.state.flipped ? styles.flippingFront : styles.flippingBack
      flipping = Object.assign({}, flipType, {transform: 'rotateY(' + rotation + 'deg)'})
    } else {
      card = this.state.flipped ? back : front
    }

    return <div style={{...styles.roomCard, ...flipping}}>
        {card}
      </div>
  }
}

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  userNametag: PropTypes.object,
}

RoomCard.contextTypes = {
  user: PropTypes.object,
}

export default RoomCard
