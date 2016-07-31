import React, { Component, PropTypes } from 'react'
import Nametag from '../../containers/Nametag/Nametag'
import Norms from '../Room/Norms'
import Join from './Join'
import errorLog from '../../utils/errorLog'
import fbase from '../../api/firebase'
import style from '../../../styles/RoomCard/RoomCard.css'
import constants from '../../constants'

class RoomCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flipped: false,
      flipping: false,
      //Set in seperate component
      mod: {
        name: '',
        bio: '',
        icon: '',
        certificates: [],
      },
      normsChecked: false,
      //Set in container ? 
      login: fbase.getAuth(),
    }
  }

  componentDidMount() {
    let self = this

    const modRef = fbase.child('nametags/' +
     this.props.id + '/' + this.props.room.mod)

    modRef.on('value', function onValue(value) {
      let modInfo = value.val()
      modInfo.nametagId = value.key()
      self.setState({mod: modInfo})
    }, errorLog('Error getting mod info in room card'))
  }

  componentWillUnmount() {
    const modRef = fbase.child('nametags/' + this.props.room.mod)
    modRef.off('value')
  }

  onNormsCheck(e) {
    this.setState({normsChecked: e.target.checked})
  }

  toggle() {
    this.setState({flipped: !this.state.flipped})

    //Set as flipping for as long as the animation is running.
    this.setState({flipping: true})
    setTimeout(
      function() {
        this.setState({flipping: false})
      }.bind(this), constants.ANIMATION_LONG)
  }

// TODO: Turn norms (and possibly other things) into seperate component.
  render() {
    let normkey = 0
    let card
    let flipping = ''

    let front =  <div className={style.front}>
            <div key='front' className={style.roomImage} onClick={this.toggle.bind(this)}>
          <img src={this.props.room.image}/>
          </div>
            <div className={style.roomInfo}>
              <div className={style.roomTime}>
                <b>Started</b> 2 days ago | <b>Ends</b> in 1 week
              </div>
              <h3 onClick={this.toggle.bind(this)}>{this.props.room.title}</h3>
              <div className={style.roomDesc}>
                {this.props.room.description}<br/>
                <p className={style.nametagCount}>
                  {this.props.room.nametagCount} participant{this.props.room.nametagCount === 1 || 's'}
                </p>
              </div>
              <hr></hr>
              <Nametag
              className={style.mod}
                roomId={this.props.id}
                id={this.props.room.mod} />
            </div>
          </div>

      let back = <div key='back' className={style.back}>
            <h3 onClick={this.toggle.bind(this)}>{this.props.room.title}</h3>
            <div className={style.norms}>
              <h4>Conversation Norms</h4>
              <Norms norms={this.props.room.norms} />
              <label class={style.checkbox}>
                <input type="checkbox" onClick={this.onNormsCheck.bind(this)}/>
                <span className={style.checkboxLabel} >I agree to abide by these norms</span>
              </label>
            </div>
            <Join
              roomId={this.props.room.id}
              normsChecked={this.state.normsChecked}/>
          </div>

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

 RoomCard.propTypes = {room: PropTypes.object}

 export default RoomCard
