'user stict';

var React = require('react'),
RoomCard = require('./RoomCard'),
errorLog = require('../../utils/errorLog');

var RoomCards= React.createClass({
	getInitialState:function() {
		return {rooms:[
			// {
			// 	title:"Test room",
			// 	description:"Lorem ipsum",
			// 	id:"abcd"
			// }
		]}
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
				<div id="roomCards">
					{this.state.rooms.map(this.showRoomCard)}
				</div>
			)
	}
});

module.exports=RoomCards;