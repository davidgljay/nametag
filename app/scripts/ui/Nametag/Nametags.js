import React, { Component, PropTypes } from 'react';
import Nametag from './Nametag';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';

class Nametags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nametags: {},
    };
  }

  componentDidMount() {
    let self = this;

    // Get badge data for each nametags
    const pBadgeRef = fbase.child('nametag_badges/' + this.props.userid + '/' + this.props.roomId);
    function getpBadges(memberid) {
      pBadgeRef.child(memberid).on('value', function onValue(badges) {
        self.setState(function setState(previousState) {
          previousState.nametags[memberid].badges = badges.val();
          return previousState;
        });
      }, errorLog('Error getting nametag badges'));
    }

    // Get nametag data
    const pRef = fbase.child('nametags/' + this.props.roomId);
    pRef.on('value', function onValue(nametags) {
      let pdata = nametags.val();
      self.setState({nametags: pdata});
      for (let nametag in pdata) {
        if ({}.hasOwnProperty.call(pdata, nametag)) {
          getpBadges(pdata[nametag].member_id);
        }
      }
    }, errorLog('Error getting partipant info'));
  }

  componentWillUnmount() {
    const pRef = fbase.child('nametags/' + this.props.roomId);
    pRef.off('value');
    for (let nametag in this.state.nametags) {
      if ({}.hasOwnProperty.call(this.state.nametags, nametag)) {
        const pBadgeRef = fbase.child(    'nametag_badges/' + this.props.userid + '/'
          + this.props.roomId + '/' + nametag);
        pBadgeRef.off('value');
      }
    }
  }

  render() {
    // Push nametags into an array;
    let nametagsArr = [];
    let self = this;
    for (let nametag in this.state.nametags) {
      if ({}.hasOwnProperty.call(this.state.nametags, nametag)) {
        this.state.nametags[nametag].member_id = nametag;
        nametagsArr.push(this.state.nametags[nametag]);
      }
    }
    nametagsArr.sort(function sortnametags(a) {
      let score = -1;
      if (a.mod) {
        score = 1;
      }
      return score;
    });

    // Create a function to return list items
    function creatnametag(nametag, mod) {
      // Make nametag.badges an empty array if it not already assigned.
      nametag.badges = nametag.badges || [];

      return <li key={nametag.name} className="list-group-item profile">
        <Nametag
          name={nametag.name}
          bio={nametag.bio}
          icon={nametag.icon}
          member_id={nametag.member_id}
          badges={nametag.badges}
          mod={mod}
          roomId={self.props.roomId}/>
      </li>;
    }

    return <ul id="nametags" className="list-group">
        {nametagsArr.map(function mapnametag(nametag) {
          return creatnametag(nametag, this.props.mod);
        }, this)}
      </ul>;
  }
}

Nametags.propTypes = { roomId: PropTypes.string, mod: PropTypes.string };
Nametags.defaultProps = {roomId: 'stampi', mod: 'wxyz', userid: 'abcd'};

export default Nametags;
