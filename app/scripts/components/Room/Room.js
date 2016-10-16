import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {indigo500} from 'material-ui/styles/colors'

import Norms from './Norms'
import Nametags from '../../containers/Nametag/NametagsContainer'
import Messages from '../../containers/Message/MessagesContainer'
import Compose from '../Message/Compose'

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leftBarExpanded: false,
    }
    this.getUserNametag = this.getUserNametag.bind(this)
  }

  getChildContext() {
    let norms = this.props.room ? this.props.room.norms : []
    return {
      userNametag: this.props.userNametag,
      room: this.props.params.roomId,
      norms,
    }
  }

  componentDidMount() {
    this.props.watchRoom(this.props.params.roomId)
    this.getUserNametag(this.props)
  }

  getUserNametag(props) {
    if (!props.userNametag && props.user.id) {
      props.getUserNametag(props.params.roomId, props.user.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getUserNametag(nextProps)
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
    // let expanded = this.state.leftBarExpanded ? style.expanded : style.collapsed
    return  <div>
      {
        this.props.userNametag && this.props.room ?
          <div>
      	    <div style={styles.header}>
                  <IconButton
                    style={styles.close}>
                    <FontIcon
                      className="material-icons"
                      onClick={this.closeRoom}
                      style={styles.closeIcon}>
                     close
                   </FontIcon>
                  </IconButton>
                  <h3 style={styles.title}>{this.props.room.title}</h3>
                <div style={styles.description}>
                  {this.props.room.description}
                </div>
            </div>
            <div>
              <div style={styles.leftBar}>
                <div style={styles.leftBarContent}>
                  <div style={styles.norms}>
                    <Norms norms={this.props.room.norms}/>
                  </div>
                   <Nametags room={this.props.params.roomId} mod={this.props.room.mod}/>
                </div>
                <div style={styles.leftBarChevron}>
                  <FontIcon
                    className="material-icons"
                    onClick={this.toggleLeftBar.bind(this)}
                    >chevron_right</FontIcon>
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
          <div style={styles.spinner}>
            <CircularProgress />
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

const styles = {
  header: {
    borderBottom: '3px solid ' + indigo500,
    position: 'fixed',
    top: 0,
    zIndex: 100,
    background: 'white',
    width: '100%',
    paddingLeft: 15,
    paddingBottom: 5,
    paddingRight: 15,
    maxHeight: 80,
  },
  title: {
    marginTop: 10,
    marginBottom: 5,
  },
  close: {
    float: 'right',
    padding: 0,
    cursor: 'pointer',
  },
  closeIcon: {
    fontSize: 12,
    width: 15,
    height: 15,
  },
  leftBar: {
    minHeight: 400,
    background: indigo500,
    marginTop: 65,
    height: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 50,
    width: 275,
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
    overflowY: 'scroll',
  },
  leftBarChevron: {
    display: 'none',
    color: 'white',
    position: 'absolute',
    top: '45%',
    left: 255,
    cursor: 'pointer',
  },
  // @media (mobile): {
  //
  //     expanded: {
  //         animation-name: 'slide-out',
  //         animation-duration: '1s',
  //         animation-fill-mode: 'forwards',
  //     },
  //
  //     collapsed: {
  //         animation-name: 'slide-in',
  //         animation-duration: '1s',
  //         animation-fill-mode: 'forwards',
  //     },
  //
  //     #leftBarChevron: {
  //         display: 'block',
  //     },
  //
  //     collapsed #leftBarChevron: {
  //         animation-name: 'spin-out',
  //         animation-duration: '1s',
  //         animation-fill-mode: 'forwards',
  //     },
  //
  //     expanded #leftBarChevron: {
  //         animation-name: 'spin-in',
  //         animation-duration: '1s',
  //         animation-fill-mode: 'forwards',
  //     },
  //
  //     description: {
  //         display: 'none',
  //     },
  // },
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh',
  },
  norms: {
    color: '#FFF',
  },
}
