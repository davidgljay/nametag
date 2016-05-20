'use strict'

var React = require('react'),
errorLog = require("../../utils/errorLog"),
Alert = require("../Utils/Alert");

var CreateRoom = React.createClass({
	getInitialState:function() {
		return {
			room: {
				title:'',
				description:'',
				image:'',
				mod:'',
				badges:[]				
			}
			mod:{
				name:'',
				bio:'',
				badges:[]
			}
		}
	},
	postRoom:function() {
		var roomsRef = new Firebase(process.env.FIREBASE_URL + "rooms/");
		var roomId = roomsRef.push(this.state.room);

		var modRef = new Firebase(process.env.FIREBASE_URL + "participants/" + roomId);
		var modId = modRef.push(this.state.mod);

		roomsRef.child(roomId + '/mod').set(modId);

		//TODO:Create confirmation of post.


	},
	render:function() {
		//Todo add participant screen
		return (
				<div id="createRoom">
					<Alert alert={this.state.alert} type={this.state.alert_type} />
					<div className="form-group">
					    <input type="text" className="form-control" id="RoomTopic" placeholder="Room Topic"/>
					    <input type="text" className="form-control" id="RoomDescription" placeholder="Room Description"/>
					    <label for="roomImage">Upload Image</label>
    					<input type="file" className="form-control-file" id="roomImage"/>
					</div>
					<div>
						<button className="btn btn-primary" onClick={postRoom}/> 
					</div>
				</div>
			)
	}
});