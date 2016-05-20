'use strict'

var React = require('react'),
errorLog = require("../../utils/errorLog"),
Alert = require("../Utils/Alert");

var CreateRoom = React.createClass({
	getInitialState:function() {
		return {
			participant: {
				name:'',
				bio:'',
				icon:'',
				badges:[]				
			}
		}
	},
	postRoom:function() {
		var participantRef = new Firebase(process.env.FIREBASE_URL + "participants/" + roomId);
		participantRef.push(this.state.participant);

		//TODO:Move to room.
	},
	render:function() {
		//TODO: Style like participant card
		//TODO:Add badges

		return (
				<div className="editProfile">
					<Alert alert={this.state.alert} type={this.state.alertType} />
					<div className="form-group">
						<img src={this.props.icon} className="img-circle icon"/>
					    <input type="text" className="form-control name" id="participantName" placeholder="Name"/>
					    <input type="text" className="form-control bio" id="participantDescription" placeholder="Bio"/>
					</div>
				</div>
			)
	}
});