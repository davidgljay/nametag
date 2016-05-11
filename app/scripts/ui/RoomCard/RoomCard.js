'user stict';

var React = require('react'),
Participant = require('../Room/Participant');

var RoomCard = React.createClass({
	getInitialState:function() {
		return {
			mod:{
				name:'',
				bio:'',
				icon:'',
				member_id:''
			},
			badges: []
		}
	},
	componentDidMount:function() {
		var modRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.props.room.id + "/" + this.props.room.mod),
		self=this;

		console.log(this.props.room)
		modRef.on('value', function(value) {
			self.setState({mod:value.val()});
		})
		for (var i = this.props.room.badges.length - 1; i >= 0; i--) {
			var badgeRef = new Firebase(process.env.FIREBASE_URL + "badges/" + this.props.room.badges[i]);
			badgeRef.on('value', function(value) {
				self.setState(function(prevState) {
					prevState.badges.push(value.val());
					return prevState;
				});
			});
		}

	},
	componentWillUnmount:function() {
		var modRef = new Firebase(process.env.FIREBASE_URL + "participants/" + this.props.room.mod);
		modRef.off('value');

		for (var i = this.props.room.badges.length - 1; i >= 0; i--) {
			var badgeRef = new Firebase(process.env.FIREBASE_URL + "badges/" + this.props.room.badges[i]);
			badgeRef.off('value');
		}
	},
	goToRoom:function() {
		window.location="/#/rooms/" + this.props.room.id;
	},
	render: function() {
		console.log(this.state.mod);
		return (
			<div className="roomCard well">
				<a href={"/#/rooms/" + this.props.room.id}><h3>{this.props.room.title}</h3></a>
				<p class="roomDesc">{this.props.room.description}</p>
				<hr></hr>
				<Participant name={this.state.mod.name} bio={this.state.mod.bio} icon={this.state.mod.icon} member_id={this.state.mod.member_id} badges={[]}/>
			</div>
			)
	}
});

RoomCard.propTypes = {room:React.PropTypes.object};

module.exports=RoomCard;