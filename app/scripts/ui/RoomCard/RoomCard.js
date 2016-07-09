 import React, { Component, PropTypes } from 'react';
import Nametag from '../Nametag/Nametag';
import Join from './Join';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';
import style from '../../../styles/RoomCard/RoomCard.css';

class RoomCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: '',
      mod: {
        name: '',
        bio: '',
        icon: '',
        certificates: [],
      },
      badges: [],
      normsChecked: false,
      nametagCount: 0,
      login: fbase.getAuth(),
    };
  }

  componentDidMount() {
    let self = this;

    const modRef = fbase.child('nametags/' +
     this.props.room.id + '/' + this.props.room.mod);

    modRef.on('value', function onValue(value) {
      let modInfo = value.val();
      modInfo.nametagId = value.key();
      self.setState({mod: modInfo});
    }, errorLog('Error getting mod info in room card'));

    const nametagRef = fbase.child('nametags/' +
      this.props.room.id);

    nametagRef.on('child_added', function onChildAdded() {
      self.setState(function setState(prevState) {
        prevState.nametagCount += 1;
        return prevState;
      });
    });
  }

  componentWillUnmount() {
    const modRef = fbase.child('nametags/' + this.props.room.mod);
    modRef.off('value');

    for (let i = this.props.room.mod_badges.length - 1; i >= 0; i--) {
      const badgeRef = fbase.child('badges/' + this.props.room.mod_badges[i]);
      badgeRef.off('value');
    }
    this.setState(function setState(prevState) {
      prevState.nametagCount = 0;
      return prevState;
    });
  }

  onNormsCheck(e) {
    this.setState({normsChecked: e.target.checked});
  }

  toggle() {
    let flipped = this.state.flipped === style.flippedFront ? style.flippedBack : style.flippedFront;
    this.setState({flipped: flipped});
  }

// TODO: Turn norms (and possibly other things) into seperate component.
  render() {
    let normkey = 0;

      return <div className={style.roomCard + ' ' + this.state.flipped}>
          <div className={style.front}>
            <div className={style.roomImage} onClick={this.toggle.bind(this)}>
          <img src={this.props.room.image}/>
          </div>
            <div className={style.roomInfo}>
              <div className={style.roomTime}>
                <b>Started</b> 2 days ago | <b>Ends</b> in 1 week
              </div>
              <h3 onClick={this.toggle.bind(this)}>{this.props.room.title}</h3>
              <div className={style.roomDesc}>
                {this.props.room.description}<br/>
                <p className={style.nametagCount}>
                  {this.state.nametagCount} participant{this.state.nametagCount === 1 || 's'}
                </p>
              </div>
              <hr></hr>
              <Nametag
              className={style.mod}
                name={this.state.mod.name}
                bio={this.state.mod.bio}
                icon={this.state.mod.icon}
                certificates={this.state.mod.certificates}
                roomId={this.props.room.id}/>
            </div>
          </div>
          <div className={style.back}>
            <h3 onClick={this.toggle.bind(this)}>{this.props.room.title}</h3>
            <div className={style.norms}>
              <h4>Conversation Norms</h4>
              <ul className={style.listgroup}>
                {this.props.room.norms.map(function(norm) {
                  normkey++;
                  return (
                    <li key={normkey} className={style.listitem}>
                      <span
                        className={style.check + ' glyphicon + glyphicon-ok'}/>
                      {norm}
                    </li>
                    );
                })}
              </ul>
              <label class={style.checkbox}>
                <input type="checkbox" onClick={this.onNormsCheck.bind(this)}/>
                <span className={style.checkboxLabel} >I agree to abide by these norms</span>
              </label>
            </div>
            <Join
              roomId={this.props.room.id}
              normsChecked={this.state.normsChecked}/>
          </div>;
        </div>;
  }
}

 RoomCard.propTypes = {room: PropTypes.object};

 export default RoomCard;
