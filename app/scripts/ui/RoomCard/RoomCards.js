'user stict';

var React = require('react'),
RoomCard = require('./RoomCard'),
errorLog = require('../../utils/errorLog'),
Navbar = require('../Utils/Navbar');

var RoomCards= React.createClass({
	getInitialState:function() {
		return {rooms:[]}
	},
	contextTypes: {
    	userAuth: React.PropTypes.object,
    	unAuth: React.PropTypes.func
  	},
	componentDidMount:function() {
		var roomsRef = new Firebase(process.env.FIREBASE_URL + "/rooms"),
		self=this;
		roomsRef.on('child_added', function(value) {
			self.setState(function(prevState) {
				var room = value.val();
				room.id = value.key();
				prevState.rooms.push(room);
				return prevState;
			})
		},errorLog("Error getting roomCards"))
	},
	componentWillUnmount:function() {
		var roomsRef = new Firebase(process.env.FIREBASE_URL + "/rooms");
		roomsRef.off('child_added')
	},
	showRoomCard:function(room) {
		return (
				<RoomCard room={room} key={room.id}/>
			)
	},
	render:function() {
		return (
			<div id="roomSelection">
				<Navbar userAuth={this.context.userAuth} unAuth={this.context.unAuth}/>
				<div id="roomCards">
					{this.state.rooms.map(this.showRoomCard)}
				</div>
			</div>
			)
	}
});

module.exports=RoomCards;