import React, { Component, PropTypes } from 'react';
import Nametag from './Nametag';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';

class Nametags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nametags: [],
    };
  }

  componentDidMount() {
    let self = this;

    // Get nametag data
    const nametagsRef = fbase.child('nametags/' + this.props.roomId);
    nametagsRef.on('child_added', function onValue(nametag) {
      let nametagData = nametag.val();
      nametagData.id = nametag.key();
      self.setState(function setState(prevState) {
        prevState.nametags.push(nametagData);
        return prevState;
      });
    }, errorLog('Error getting partipant info'));
  }

  componentWillUnmount() {
    const nametagsRef = fbase.child('nametags/' + this.props.roomId);
    nametagsRef.off('value');
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
          certificates={nametag.certificates}
          mod={mod}/>
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

export default Nametags;
