import React, { Component, PropTypes } from 'react'
import {watchRoom, unWatchRoom} from '../../actions/RoomActions'
import {getUserNametag} from '../../actions/UserActions'
import {Spinner} from 'react-mdl'
import Norms from './Norms'
import Nametags from '../../containers/Nametag/NametagsContainer'
import Messages from '../../containers/Message/MessagesContainer'
import Compose from '../Message/Compose'
import style from '../../../styles/Room/Room.css'

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leftBarExpanded: false,
    }
  }

  getChildContext() {
    let norms = this.props.room ? this.props.room.norms : []
    return {
      userNametag: this.props.userNametag,
      room: this.props.params.roomId,
      norms,
    }
  }

  getUserNametag() {

  }

  componentDidMount() {
    this.props.watchRoom(this.props.params.roomId)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.userNametag && nextProps.user.id) {
      this.props.getUserNametag(this.props.params.roomId, nextProps.user.id)
    }
  }

  componentWillUnmount() {
    this.props.unWatchRoom(this.props.params.roomId)
  }

  closeRoom() {
    window.location = '/#/rooms/'
  }

  toggleLeftBar() {
    this.setState({leftBarExpanded: !this.state.leftBarExpanded})
  }

  render() {
    let expanded = this.state.leftBarExpanded ? style.expanded : style.collapsed
    return  <div>
      {
        this.props.userNametag && this.props.room ?
          <div>
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
              <Compose
                postMessage={this.props.postMessage}
                addMessage={this.props.addMessage}
                addRoomMessage={this.props.addRoomMessage}/>
            }
          </div>
          :
          <div className={style.spinner}>
            <Spinner />
          </div>
        }
      </div>
  }
}

Room.propTypes = {
  postMessage: PropTypes.func.isRequired,
  userNametag: PropTypes.string,
  room: PropTypes.object,
}

Room.childContextTypes = {
  userNametag: PropTypes.string,
  room: PropTypes.string,
  norms: PropTypes.array,
}

export default Room
