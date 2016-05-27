'use strict'

var React = require('react'),
errorLog = require("../../utils/errorLog"),
Alert = require("../Utils/Alert");

var EditNametag = React.createClass({
	getInitialState:function() {
		return {
			default: {
				name:'',
				bio:'',
				icon:''				
			},
			badges:[],
			alert:null,
			alertType:null
		}
	},
	componentDidMount:function() {
		var self=this,
		defaultsRef = new Firebase(process.env.FIREBASE_URL + "user_defaults/" + this.props.login.uid);
		defaultsRef.on("value", function(value) {
			self.setState(function(prevState) {
				prevState.defaults=value.val();
				prevState.default.name = prevState.defaults.names[0];
				prevState.default.bio = prevState.defaults.bios[0];
				prevState.default.icon = prevState.defaults.icons[0];
				return prevState;
			});
		})
	},
	componentWillUnmount:function() {
		var defaultsRef = new Firebase(process.env.FIREBASE_URL + "user_defaults/" + this.props.login.uid);
		defaultsRef.off("value");
	},
	postRoom:function() {
		var participantRef = new Firebase(process.env.FIREBASE_URL + "participants/" + roomId);
		participantRef.push(this.state.participant);

		//TODO:Move to room.
	},
	render:function() {
		//TODO: Style like participant card
		//TODO:Add badges
		// return (<div>Editname</div>);
		return (
				<div className="editProfile">
					<Alert alert={this.state.alert} type={this.state.alertType} />
					<div className="form-group">
						<img src={this.state.default.icon} className="img-circle icon"/>
					    <input type="text" className="form-control name" id="participantName" placeholder={this.state.default.name}/>
					    <input type="text" className="form-control bio" id="participantDescription" placeholder={this.state.default.bio}/>
					</div>
				</div>
			)
	}
});

EditNametag.propTypes = {login:React.PropTypes.object};

module.exports=EditNametag;