'user stict';

var React = require('react'),
Participant = require('../Room/Participant'),
errorLog = require("../../utils/errorLog");

var RoomCard = React.createClass({
	getInitialState:function() {
		return {
			mod:{
				name:'',
				bio:'',
				icon:'',
				member_id:''
			},
			badges: [],
			participantCount:0
		}
	},
	componentDidMount:function() {
		var modRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.props.room.id + "/" + this.props.room.mod),
		self=this;

		modRef.on('value', function(value) {
			self.setState({mod:value.val()});
		}, errorLog('Error getting mod info in room card'));
		for (var i = this.props.room.mod_badges.length - 1; i >= 0; i--) {
			var badgeRef = new Firebase(process.env.FIREBASE_URL + "badges/" + this.props.room.mod_badges[i]);
			badgeRef.on('value', function(value) {
				self.setState(function(prevState) {
					prevState.badges.push(value.val());
					return prevState;
				});
			}, errorLog('Error getting badge info for room card'));
		}

		var particRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.props.room.id);
		particRef.on("child_added", function() {
			self.setState(function(prevState) {
				prevState.participantCount += 1;
				return prevState;
			})
		})

	},
	componentWillUnmount:function() {
		var modRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.props.room.mod);
		modRef.off('value');

		for (var i = this.props.room.mod_badges.length - 1; i >= 0; i--) {
			var badgeRef = new Firebase(process.env.FIREBASE_URL + "badges/" + this.props.room.mod_badges[i]);
			badgeRef.off('value');
		}
		this.setState(function(prevState) {
			prevState.participantCount =0;
			return prevState;
		})
	},
	goToRoom:function() {
		window.location="/#/rooms/" + this.props.room.id;
	},
	render: function() {
		//TODO: 
		return (
			<div className="roomCard row">
				<div className="roomImage col-md-3">
					<img className="img-rounded" src={this.props.room.icon}/>
				</div>
				<div className="roomInfo col-md-5">
					<div className="roomTime">
						<b>started:</b> 2 days ago<br/>
						<b>ends:</b> in 1 week
					</div>
					<h3>{this.props.room.title}</h3>
					<p className="roomDesc">
						{this.props.room.description}<br/>
						<p className="participantCount">{this.state.participantCount} participant{this.state.participantCount == 1 || 's'}</p>
					</p>

					<hr></hr>
					<Participant className="mod" name={this.state.mod.name} bio={this.state.mod.bio} icon={this.state.mod.icon} member_id={this.state.mod.member_id} badges={this.state.badges}/>
				</div>
			</div>
			)
	}
});

RoomCard.propTypes = {room:React.PropTypes.object};

module.exports=RoomCard;