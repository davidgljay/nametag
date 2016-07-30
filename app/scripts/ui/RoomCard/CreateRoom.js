import React, { Component, PropTypes } from 'react'

import errorLog from '../../utils/errorLog'

import Alert from '../Utils/Alert'

import fbase from '../../api/firebase'


class CreateRoom extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      room: {
        title: '',
        description: '',
        image: '',
        mod: '',
        badges: [],
      },
      mod: {
        name: '',
        bio: '',
        badges: [],
      },
      alert='',
      alertType='',
    }
    
  }

  postRoom() {
    const roomsRef = fbase.child('rooms/')
    
    const roomId = roomsRef.push(this.state.room)
    
    const modRef = fbase.child('participants/' + roomId)
    
    const modId = modRef.push(this.state.mod)
    

    roomsRef.child(roomId + '/mod').set(modId)
    

    // TODO:Create confirmation of post.
  }

  render() {
    // Todo add participant screen
    return (
        <div id="createRoom">
          <Alert alert={this.state.alert} type={this.state.alertType} />
          <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="RoomTopic"
                placeholder="Room Topic"/>
              <input
                type="text"
                className="form-control"
                id="RoomDescription"
                placeholder="Room Description"/>
              <label for="roomImage">Upload Image</label>
              <input type="file" className="form-control-file" id="roomImage"/>
          </div>
          <div>
            <button className="btn btn-primary" onClick={postRoom}/> 
          </div>
        </div>
      )
  }
}
