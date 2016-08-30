import React, { Component, PropTypes } from 'react'
import {watchRoom, unWatchRoom} from '../../actions/RoomActions'
import {getUserNametag} from '../../actions/UserActions'
import {Spinner} from 'react-mdl'
import Norms from './Norms'
import Nametags from '../../containers/Nametag/NametagsContainer'
import Messages from '../../containers/Message/MessagesContainer'
// import Compose from '../Message/Compose'
import style from '../../../styles/Room/Room.css'

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leftBarExpanded: false,
    }
  }

  // getChildContext() {
  //   return {
  //     nametagId: this.state.nametagId,
  //     roomId: this.props.params.roomId,
  //   }
  // }

  getUserNametag() {

  }

  componentDidMount() {
    this.props.dispatch(watchRoom(this.props.params.roomId))
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.user.id &&
    !(this.props.user.nametags && this.props.user.nametags[this.props.params.roomId])) {
      this.props.dispatch(getUserNametag(this.props.params.roomId, nextProps.user.id))
    }
  }
  	// // TODO: mark the user as active in the room.
   //  const roomRef = fbase.child('/rooms/' + this.props.params.roomId)


   //  roomRef.on('value', function onValue(value) {
   //    this.setState({room: value.val()})

   //  }, errorLog('Error getting room from FB'), this)


   //  const nametagIdRef = fbase.child('user_rooms/'
   //    + this.context.userAuth.uid + '/'
   //    + this.props.params.roomId)


   //  nametagIdRef.on('value', function onValue(value) {
   //    const ntid = value.val().nametag_id

   //    this.setState({nametagId: ntid})

   //  },this)

  componentWillUnmount() {
    this.props.dispatch(unWatchRoom(this.props.params.roomId))
  }

  closeRoom() {
    window.location = '/#/rooms/'
  }

  toggleLeftBar() {
    this.setState({leftBarExpanded: !this.state.leftBarExpanded})
  }

  render() {
    let room = <div className={style.spinner}>
        <Spinner />
      </div>

    let expanded = this.state.leftBarExpanded ? style.expanded : style.collapsed
    if (this.props.user.nametags && this.props.user.nametags[this.props.params.roomId]) {
      room = <div>
    	    <div className={style.header}>
                 <span
                  onClick={this.closeRoom}
                  className={style.close + ' glyphicon glyphicon-remove'}/>
                <h3>{this.props.room.title}</h3>
              <div className={style.description}>
                {this.props.room.description}
              </div>
          </div>
           <div>
            <div id={style.leftBar} className={expanded}>
              <div id={style.leftBarContent}>
                <div id={style.norms}>
                  <Norms norms={this.props.room.norms}/>
                </div>
                 <Nametags room={this.props.params.roomId} mod={this.props.room.mod}/>
              </div>
              <div id={style.leftBarChevron}>
                <span
                  onClick={this.toggleLeftBar.bind(this)}
                  className={'glyphicon glyphicon-chevron-right'}
                  />
              </div>
            </div>
              {
                <Messages
                room={this.props.params.roomId}/>
              }
          </div>
          {
          // <Compose
            // roomId={this.props.params.roomId}
            // nametagId={this.state.nametagId}/>
          }
      </div>
    }
    return room
  }
}

Room.childContextTypes = {
  nametagId: PropTypes.string,
  roomId: PropTypes.string,
}

export default Room
