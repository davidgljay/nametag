'use strict';

var React = require('react'),
Participants = require('./Participants'),
Messages = require('./Messages'),
Compose = require('./Compose');

var Room = React.createClass({
  getInitialState: function() {
  	var fbref=new Firebase('https://badgespace.firebaseio.com/rooms/'+this.props.roomId);

    fbref.on('value',function(value) {
       this.setState({room:value.val()});
    }, 
    function(err) {
      console.log("Error getting room from FB:" + err);
    }, this);

    return {
      fbref:fbref,
      room:{
        title:'',
        norms:[]
      }
    }
  },
  //Set participantId and roomId as context for the room.
  childContextTypes: {
    participantId: React.PropTypes.string,
    roomId: React.PropTypes.string
  },
  getChildContext: function() {
    return {
      participantId: this.props.participantId,
      roomId: this.props.roomId
    };
  },
  componentDidMount: function() {
  	//TODO: mark the user as active in the room.

  },
  componentWillUnmount: function() {
  	//TODO: mark the user as inactive when they leave the room.
  },
  render: function() {
    //TODO: Move norms to stateless object

    return (
    	<div>
    	    <div className="header">
                <ul className="nav nav-pills pull-right">
                    <li><a href="#"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></li>
                </ul>
                <h3 className="text-muted">{this.state.room.title}</h3>
              <div id="description">{this.state.room.description}</div>
          </div>
          <div>
            <div id="leftBar">
              <div id="leftBarContent">
                <div id="norms">
                  <h4>Norms:</h4>
                  <ul id="normlist">
                    {this.state.room.norms.map(function(norm) {
                      return (
                        <li key={norm} className="norm">
                          {norm}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <Participants roomId={this.props.roomId} mod={this.props.mod}/>
                <div className="footer">
                    <p>Built with ♥ by some queers</p>
                </div>
              </div>
            </div>
            <div id="chat">
              <Messages roomId={this.props.roomId} participantId={this.props.participantId}/>
            </div>
          </div>
          <Compose roomId={this.props.roomId} participantId={this.props.participantId} />
      </div>
    );
  }
});

Room.propTypes = { roomId: React.PropTypes.string };
Room.defaultProps = {
  roomId:'stampi',
  participantId:'wxyz'
};


module.exports = Room;