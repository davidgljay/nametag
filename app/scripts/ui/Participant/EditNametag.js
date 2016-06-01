'use strict'

var React = require('react'),
errorLog = require("../../utils/errorLog"),
Alert = require("../Utils/Alert");

var EditNametag = React.createClass({
	getInitialState:function() {
		return {
			nametag: {
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
				prevState.nametag.name = prevState.defaults.names[0];
				prevState.nametag.bio = prevState.defaults.bios[0];
				prevState.nametag.icon = prevState.defaults.icons[0];
				return prevState;
			});
		})
	},
	componentWillUnmount:function() {
		var defaultsRef = new Firebase(process.env.FIREBASE_URL + "user_defaults/" + this.props.login.uid);
		defaultsRef.off("value");
	},
	render:function() {
		//TODO:Add badges
		//TODO: Figure out image caching
		// return (<div>Editname</div>);
		return (
				<div className="editNametag profile">
					<Alert alert={this.state.alert} type={this.state.alertType} />
					<div className="form-group">
						<img src={this.state.nametag.icon} className="img-circle icon"/>
					    <input type="text" className="form-control name" id="participantName" onChange={this.props.updateNametag('name')} value={this.state.nametag.name}/>
					    <textarea rows="2" className="form-control bio" id="participantDescription" onChange={this.props.updateNametag('bio')} value={this.state.nametag.bio}/>
					</div>
				</div>
			)
	}
});

EditNametag.propTypes = {login:React.PropTypes.object, roomId:React.PropTypes.string, updateNametag:React.PropTypes.func};

module.exports=EditNametag;