import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';
import style from '../../../styles/Room/ModActionNotif.css'

class ModActionNotif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      mod: '',
      author: '',
    };
  }

  componentDidMount() {
    // Get info for the mod and the message in question.
    const msgRef = fbase.child('messages/' + this.props.modAction.msgId);
    const modRef = fbase.child('nametags/' + this.context.roomId  + '/' + this.props.modAction.modId);
    const authorRef = fbase.child('nametags/' + this.context.roomId + '/' + this.props.modAction.author);
    let self = this;
    msgRef.on('value', function onValue(value) {
      self.setState({message: value.val().text});
    }, errorLog('Error getting message in modActionNotif'));

    modRef.on('value', function onValue(value) {
      self.setState({mod: value.val()});
    }, errorLog('Error getting mod info in modActionNotif'));

    authorRef.on('value', function onValue(value) {
      self.setState(function setState(prevState) {
        prevState.author = value.val();
        prevState.author.id = value.key();
        return prevState;
      });
    }, errorLog('Error getting author info in modActionNotif'));
  }

  componentWillUnmount() {
    const msgRef = fbase.child('messages/' + this.props.modAction.msgId);
    const modRef = fbase.child('nametags/' + this.context.roomId  + '/' + this.props.modAction.modId);
    const authorRef = fbase.child('nametags/' + this.context.roomId + '/' + this.props.modAction.author);
    msgRef.off('value');
    modRef.off('value');
    authorRef.off('value');
  }

  render() {
    let callout;
    function showNorms(norm) {
      return <li className={style.norm} key={norm.id}>{norm.text}</li>;
    }

    // Change callout based on whether the message is addressed to the current user.
    if (this.state.author.id === this.context.nametagId) {
      callout =
          <div>
            <p>
              {this.state.mod.name} would like to remind you of the
              following norm{this.props.modAction.norms.length === 1 || 's'}:
            </p>
          </div>;
    } else {
      callout =
        <p>
          {this.state.mod.name} has reminded {this.state.author.name}
          of the following norm{this.props.modAction.norms.length === 1 || 's'}:
        </p>;
    }
    return (
      <tr className={style.modActionNotif}>
        <td className="icon">
          <img className="img-circle" src={this.state.mod.icon}/>
        </td>
        <td>
          {callout}
          <ul>
            {this.props.modAction.norms.map(showNorms)}
          </ul>
          <p>Regarding the statement:</p>
          <div className={style.quote}>{this.state.message}</div>
          <div className={style.modNote}>{this.props.modAction.note}</div>
        </td>
      </tr>
      );
  }
}

ModActionNotif.propTypes = {modAction: PropTypes.object};
ModActionNotif.contextTypes = {
  roomId: PropTypes.string,
  nametagId: PropTypes.string,
};

export default ModActionNotif;
