'user stict';

var React = require('react'),
Participant = require('../Participant/Participant'),
Join = require('./Join'),
errorLog = require("../../utils/errorLog");

var RoomCard = React.createClass({
	getInitialState:function() {
		return {
			expanded:false,
			mod:{
				name:'',
				bio:'',
				icon:'',
				member_id:''
			},
			badges: [],
			participantCount:0,
			login: new Firebase(process.env.FIREBASE_URL).getAuth()
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
	toggle:function(expanded) {
		var self=this;
		return function(e) {
			self.setState({expanded:expanded});
		}
	},
	render: function() {
		var joinPrompt = '',
		normkey=0;

		if (this.state.expanded) {
			joinPrompt=(
					<div className="expanded">
						<div className="norms">
							<h4>Conversation Norms</h4>
							<ul className="list-group">
								{this.props.room.norms.map(function(norm) {
									normkey++;
									return (
										<li key={normkey} className="list-group-item">
											<span className="glyphicon glyphicon-ok" aria-hidden="true" ></span>
											{norm}
										</li>
										);
								})}
							</ul>
							<label class="c-input c-checkbox">
							  <input type="checkbox"/>
							  <span>I agree to abide by these norms</span>
							</label>
						</div>
						<Join roomId={this.props.roomId}/>
						<div className="downChevron" onClick={this.toggle(false)}>
							<span className="glyphicon glyphicon-chevron-up" aria-hidden="true" ></span>
						</div>
					</div>
				)
		} else {
			joinPrompt = (
				<div className="downChevron" onClick={this.toggle(true)}>
					<span className="glyphicon glyphicon-chevron-down" aria-hidden="true" ></span>
				</div>
				);
		}

		return (
			<div className="roomCard">
				<div className="roomImage">
					<img className="img-rounded" src={this.props.room.image}/>
				</div>
				<div className="roomInfo">
					<div className="roomTime">
						<b>started:</b> 2 days ago<br/>
						<b>ends:</b> in 1 week
					</div>
					<h3>{this.props.room.title}</h3>
					<div className="roomDesc">
						{this.props.room.description}<br/>
						<p className="participantCount">{this.state.participantCount} participant{this.state.participantCount == 1 || 's'}</p>
					</div>

					<hr></hr>
					<Participant className="mod" name={this.state.mod.name} bio={this.state.mod.bio} icon={this.state.mod.icon} member_id={this.state.mod.member_id} badges={this.state.badges}/>
					{joinPrompt}	
				</div>
			</div>
			)
	}
});

RoomCard.propTypes = {room:React.PropTypes.object};

module.exports=RoomCard;