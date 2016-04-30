'use strict';

var React = require('react'),
Participants = require('./Participants'),
Messages = require('./Messages'),
Compose = require('./Compose');

var Room = React.createClass({
  getInitialState: function() {
  	var fbref=new Firebase('https://badgespace.firebaseio.com/rooms/'+this.props.roomid);

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
          <div className="row">
            <div id="leftBar" className="col-md-3" >
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
              <Participants roomid={this.props.roomid} mod={this.props.mod}/>
            </div>
            <div className="col-md-9">
              <Messages roomid={this.props.roomid}/>
              <Compose roomid={this.props.roomid}/>
            </div>
          </div>
      </div>
    );
  }
});

Room.propTypes = { roomid: React.PropTypes.string };
Room.defaultProps = {roomid:'stampi'};


module.exports = Room;