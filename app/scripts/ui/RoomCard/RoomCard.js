import React, { Component, PropTypes } from 'react';
import Nametag from '../Nametag/Nametag';
import Join from './Join';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';

class RoomCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      mod: {
        name: '',
        bio: '',
        icon: '',
        member_id: '',
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
      self.setState({mod: value.val()});
    }, errorLog('Error getting mod info in room card'));
    for (let i = this.props.room.mod_badges.length - 1; i >= 0; i--) {
      const badgeRef = fbase.child('badges/' +
        this.props.room.mod_badges[i]);

      badgeRef.on('value', function onValue(value) {
        self.setState(function setState(prevState) {
          prevState.badges.push(value.val());
          return prevState;
        });
      }, errorLog('Error getting badge info for room card'));
    }

    const particRef = fbase.child('nametags/' +
      this.props.room.id);

    particRef.on('child_added', function onChildAdded() {
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

  toggle(expanded) {
    const self = this;
    return function onClick() {
      self.setState({expanded: expanded});
    };
  }

  render() {
    let joinPrompt = '';
    let normkey = 0;

    if (this.state.expanded) {
      joinPrompt =
          <div className="expanded">
            <div className="norms">
              <h4>Conversation Norms</h4>
              <ul className="list-group">
                {this.props.room.norms.map(function(norm) {
                  normkey++;
                  return (
                    <li key={normkey} className="list-group-item">
                      <span
                        className="glyphicon glyphicon-ok"
                        aria-hidden="true" >
                      </span>
                      {norm}
                    </li>
                    );
                })}
              </ul>
              <label class="c-input c-checkbox">
                <input type="checkbox" onClick={this.onNormsCheck.bind(this)}/>
                <span>I agree to abide by these norms</span>
              </label>
            </div>
            <Join
              roomId={this.props.room.id}
              normsChecked={this.state.normsChecked}/>
            <div className="downChevron" onClick={this.toggle(false).bind(this)}>
              <span
                className="glyphicon glyphicon-chevron-up"
                aria-hidden="true" ></span>
            </div>
          </div>;
    } else {
      joinPrompt =
        <div className="downChevron" onClick={this.toggle(true).bind(this)}>
          <span
            className="glyphicon glyphicon-chevron-down" 
            aria-hidden="true" ></span>
        </div>;
    }

    return <div className="roomCard">
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
            <p className="NametagCount">
              {this.state.nametagCount} participant{this.state.nametagCount === 1 || 's'}
            </p>
          </div>

          <hr></hr>
          <Nametag
            className="mod"
            name={this.state.mod.name}
            bio={this.state.mod.bio}
            icon={this.state.mod.icon}
            member_id={this.state.mod.member_id}
            badges={this.state.badges}/>
          {joinPrompt}
        </div>
      </div>;
  }
}

RoomCard.propTypes = {room: PropTypes.object};

export default RoomCard;
