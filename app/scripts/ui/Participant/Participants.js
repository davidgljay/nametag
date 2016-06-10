import React, { Component, PropTypes } from 'react';
import Participant from './Participant';
import errorLog from '../../utils/errorLog';

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: {},
    };
  }

  componentDidMount() {
    let self = this;

    // Get badge data for each participants
    const pBadgeRef = new Firebase(process.env.FIREBASE_URL +
      'participant_badges/' + this.props.userid + '/' + this.props.roomId);
    function getpBadges(memberid) {
      pBadgeRef.child(memberid).on('value', function onValue(badges) {
        self.setState(function setState(previousState) {
          previousState.participants[memberid].badges = badges.val();
          return previousState;
        });
      }, errorLog('Error getting participant badges'));
    }

    // Get participant data
    const pRef = new Firebase(process.env.FIREBASE_URL +
      'participants/' + this.props.roomId);
    pRef.on('value', function onValue(participants) {
      let pdata = participants.val();
      self.setState({participants: pdata});
      for (let participant in pdata) {
        if ({}.hasOwnProperty.call(pdata, participant)) {
          getpBadges(pdata[participant].member_id);
        }
      }
    }, errorLog('Error getting partipant info'));
  }

  componentWillUnmount() {
    const pRef = new Firebase(process.env.FIREBASE_URL +
      'participants/' + this.props.roomId);
    pRef.off('value');
    for (let participant in this.state.participants) {
      if ({}.hasOwnProperty.call(this.state.participants, participant)) {
        const pBadgeRef = new Firebase(process.env.FIREBASE_URL +
          'participant_badges/' + this.props.userid + '/'
          + this.props.roomId + '/' + participant);
        pBadgeRef.off('value');
      }
    }
  }

  render() {
    // Push participants into an array;
    let participantsArr = [];
    for (let participant in this.state.participants) {
      if ({}.hasOwnProperty.call(this.state.participants, participant)) {
        this.state.participants[participant].member_id = participant;
        participantsArr.push(this.state.participants[participant]);
      }
    }
    participantsArr.sort(function sortParticipants(a) {
      let score = -1;
      if (a.mod) {
        score = 1;
      }
      return score;
    });

    // Create a function to return list items
    function creatParticipant(participant, mod) {
      // Make participant.badges an empty array if it not already assigned.
      participant.badges = participant.badges || [];

      return <li key={participant.name} className="list-group-item profile">
        <Participant
          name={participant.name}
          bio={participant.bio}
          icon={participant.icon}
          member_id={participant.member_id}
          badges={participant.badges}
          mod={mod}/>
      </li>;
    }

    return <ul id="participants" className="list-group">
        {participantsArr.map(function mapParticipant(participant) {
          return creatParticipant(participant, this.props.mod);
        }, this)}
      </ul>;
  }
}

Participants.propTypes = { roomId: PropTypes.string, mod: PropTypes.string };
Participants.defaultProps = {roomId: 'stampi', mod: 'wxyz', userid: 'abcd'};

export default Participants;
