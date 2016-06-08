import React, { Component, PropTypes } from 'react';
import errorLog from '../../utils/errorLog';

class ModAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      norms: [],
      isPublic: false,
      note: '',
      escalated: false,
    };
  }

  componentDidMount() {
    const self = this;
    const normsRef = new Firebase(process.env.FIREBASE_URL +
      'rooms/' + this.context.roomId + '/norms');
    normsRef.on('child_added', function onChildAdded(value) {
      self.setState(function setState(previousState) {
        previousState.norms.push({
          text: value.val(),
          id: previousState.norms.length,
          checked: false,
        });
        return previousState;
      });
    }, errorLog('Error getting room norms'));
  }

  showNorm(norm) {
    return <li
      className="list-group-item chooseNorm"
      key={norm.id}
      onClick={this.checkNorm(norm.id)}>
        <label className="c-input c-checkbox" >
          <input type="checkbox" checked={norm.checked}/>
          <span className="c-indicator"></span>
           {norm.text}
        </label>
      </li>;
  }

  checkNorm(normId) {
    let self = this;
    return function onClick(e) {
      e.preventDefault();
      // Need to setTimeout so that preventDefault doesn't break checkboxes
      // This is a React-recommended hack.
      setTimeout(function delayed() {
        self.setState(function setState(previousState) {
          previousState.norms[normId].checked = !previousState.norms[normId].checked;
          return previousState;
        });
      }, 1);
    };
  }

  preventDefault(e) {
    e.preventDefault();
  }

  remindOfNorms() {
    let self = this;
    const modActionRef = new Firebase(process.env.FIREBASE_URL + 'mod_actions/');
    // TODO: Allow edits without breaking append-only rule (right now there's one modaction per comment)

    function isChecked(item) {
      return item.checked;
    }

    let modAction = {
      action: 'warn',
      norms: this.state.norms.filter(isChecked),
      note: this.state.note,
      timestamp: new Date().getTime(),
      modId: this.context.participantId,
      author: this.props.author.id,
    };

    function postComplete(err) {
      if (err) {
        self.setState({alert: 'Error posting reminder'});
        errorLog('Error putting mod Action')(err);
      } else {
        self.props.close();
      }
    }

    if (modAction.norms.length === 0) {
      self.setState({alert: 'Please check at least one norm.'});
      return;
    }

    // Update firebase with modaction for the user.
    if (this.state.isPublic) {
      modActionRef.child(this.context.roomId +
        '/public/' + this.props.msgId + '/')
        .set(modAction, postComplete);
    } else {
      modActionRef.child(this.context.roomId +
        '/private/' + this.props.author.id + '/' +
        this.props.msgId + '/')
        .set(modAction, postComplete);
    }
  }

  setPublic(isPublic) {
    let self = this;
    return function onClick() {
      self.setState({isPublic: isPublic});
    };
  }

  escalate() {
    this.setState({escalated: true});
  }

  removeUser() {
    // TODO: Add functionality to remove user.
  }

  addNote(e) {
    this.setState({note: e.target.value});
  }

  render() {
    // TODO: I could add complexity here, cite multiple posts, etc.
    // TODO: Create a system for notifying badgeholders.
    let visText;
    let alert;
    if (this.state.alert) {
      alert =
        <div className="alert alert-danger" role="alert">
          {this.state.alert}
        </div>;
    }

    if (this.state.isPublic) {
      visText =
        <p>
          <span
            aria-hidden="true"
            className="glyphicon glyphicon-eye-open">
          </span>
          Visible to everyone in the room.
        </p>;
    } else {
      visText =
        <p>
          <span
          aria-hidden="true"
          className="glyphicon glyphicon-eye-close">
          </span>
          Visible only to the author of this message.
        </p>;
    }

    return <div id="modAction">
        {alert}
        <span
          aria-hidden="true"
          className="glyphicon glyphicon-remove"
          onClick={this.props.close}></span>
        <h4>Remind {this.props.author.name} of Conversation Norms</h4>
        <ul className="list-group">
        {this.state.norms.map(this.showNorm)}
        </ul>
        <input
          type="text"
          className="form-control"
          onChange={this.addNote}
          placeholder="Add an optional note."
          value={this.state.message}/>
        <div className="chooseVis">
          <div className="btn-group" data-toggle="buttons">
            <label
              className={
                'btn btn-default ' + (this.state.isPublic || 'active')
              }>
              <input type="radio" id="privateAction" onClick={this.setPublic(false)} />
              Private
            </label>
            <label className={'btn btn-default ' + (!this.state.isPublic || 'active')}>
              <input type="radio" id="publicAction" onClick={this.setPublic(true)}/>
              Public
            </label>
          </div>
          <div className="visText">
            {visText}
          </div>
        </div>
        <div className="modActions">
          <button className="btn btn-primary" onClick={this.remindOfNorms}>
            Remind
          </button>
          <button
            className={'btn btn-link escalateLink ' + (!this.state.escalated || 'hide')}
            onClick={this.escalate}>
              Escalate
          </button>
          <button
            className={'btn btn-danger ' + (this.state.escalated || 'hide')}
            onClick={this.removeUser}>
              Remove {this.props.author.name} From Room
          </button>
          <button
            className={'btn btn-danger ' + (this.state.escalated || 'hide')}
            onClick={this.notifyBadge}>
              Notify Badge Granters
          </button>
        </div>
        </div>;
  }
}

ModAction.propTypes = {
  msgId: PropTypes.string,
  close: PropTypes.func,
  author: PropTypes.object };
ModAction.contextTypes = {
  participantId: PropTypes.string,
  roomId: PropTypes.string,
};

export default ModAction;
