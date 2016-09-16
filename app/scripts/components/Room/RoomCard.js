import React, { Component, PropTypes } from 'react'
import Nametag from '../../containers/Nametag/NametagContainer'
import Norms from '../Room/Norms'
import Join from './Join'
import style from '../../../styles/RoomCard/RoomCard.css'
import constants from '../../constants'
import {Card, CardTitle} from 'react-mdl'

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
      this.state.checkingForNametag) {
      this.setState({checkingForNametag: true})
      this.props.getUserNametag(this.props.id, this.context.user.id)
        .then((userNametag) => {
          this.setState({checkingForNametag: false})
          if (!userNametag) {
            return {room: this.props.id}
          }
          console.log('Found user nametag:' + userNametag.nametag)
          return this.props.watchNametag(userNametag.nametag)
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
    this.setState({flipped: !this.state.flipped})

    //Set as flipping for as long as the animation is running.
    this.setState({flipping: true})
    setTimeout(
      function() {
        this.setState({flipping: false})
      }.bind(this), constants.ANIMATION_LONG)
  }

  render() {
    let card
    let flipping = ''

    let front =  <Card key='front' className={style.front} shadow={1}>
          <CardTitle className={style.roomImage}
            style={{background: 'url(' + this.props.room.image + ') center / cover'}}
            onClick={this.flip}/>
          <div className={style.roomInfo}>
            <div className={style.roomTime}>
              <b>Started</b> 2 days ago | <b>Ends</b> in 1 week
            </div>
            <h3 onClick={this.flip.bind(this)}>{this.props.room.title}</h3>
            <div className={style.roomDesc}>
              {this.props.room.description}<br/>
              <p className={style.nametagCount}>
                {this.props.room.nametagCount} participant{this.props.room.nametagCount === 1 || 's'}
              </p>
            </div>
            <hr></hr>
            <Nametag
              className={style.mod}
              room={this.props.id}
              id={this.props.room.mod}
              mod={this.props.room.mod} />
              </div>
          </Card>

    let back = <Card key='back' className={style.back} shadow={1}>
          <h3 onClick={this.flip.bind(this)}>{this.props.room.title}</h3>
          <div className={style.norms}>
            <h4>Conversation Norms</h4>
            <Norms norms={this.props.room.norms} showChecks={true}/>
            <label className={style.checkbox}>
              <input type="checkbox" onClick={this.onNormsCheck}/>
              <span className={style.checkboxLabel} >I agree to abide by these norms</span>
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
      flipping = this.state.flipped ? style.flippingFront : style.flippingBack
    } else {
      card = this.state.flipped ? back : front
    }

    return <div className={style.roomCard + ' ' + flipping}>
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
