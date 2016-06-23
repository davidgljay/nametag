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
    const nametagBadgeRef = fbase.child('nametag_badges/' + this.props.userid + '/' + this.props.roomId);
    function getpBadges(memberid) {
      nametagBadgeRef.child(memberid).on('value', function onValue(badges) {
        self.setState(function setState(previousState) {
          previousState.nametags[id].badges = badges.val();
          return previousState;
        });
      }, errorLog('Error getting nametag badges'));
    }

    // Get nametag data
    const nametagsRef = fbase.child('nametags/' + this.props.roomId);
    nametagsRef.on('value', function onValue(nametags) {
      let nametagsData = nametags.val();
      self.setState({nametags: nametagsData});
      for (let nametag in nametagsData) {
        if ({}.hasOwnProperty.call(nametagsData, nametag)) {
          getpBadges(nametagsData[nametag].nametagId);
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
    let self = this;
    let nametagsArr = [];
    for (let nametag in this.state.nametags) {
      if ({}.hasOwnProperty.call(this.state.nametags, nametag)) {
        this.state.nametags[nametag].id = nametag;
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

      return <li key={nametag.id} className="list-group-item profile">
        <Nametag
          name={nametag.name}
          bio={nametag.bio}
          icon={nametag.icon}
          nametagId={nametag.id}
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
