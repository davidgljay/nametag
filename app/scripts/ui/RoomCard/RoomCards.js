'user stict';

var React = require('react'),
RoomCard = require('./RoomCard');

var RoomCards= React.createClass({
	getInitialState:function() {
		return {rooms:[]}
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
		},
		function(err) {
			console.log(err);
		})
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
				<div id="RoomCards">
					{this.state.rooms.map(this.showRoomCard)}
				</div>
			)
	}
});

module.exports=RoomCards;