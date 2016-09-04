import React, { Component, PropTypes } from 'react'
import errorLog from '../../utils/errorLog'
import fbase from '../../api/firebase'
import style from '../../../styles/Message/ModAction.css'
import Alert from '../Utils/Alert'

class ModAction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      norms: [],
      isPublic: false,
      note: '',
      escalated: false,
    }
  }

  componentDidMount() {
    const self = this
    const normsRef = fbase.child('rooms/' + this.context.roomId + '/norms')
    normsRef.on('child_added', function onChildAdded(value) {
      self.setState(function setState(previousState) {
        previousState.norms.push({
          text: value.val(),
          id: previousState.norms.length,
          checked: false,
        })
        return previousState
      })
    }, errorLog('Error getting room norms'))
  }

  componentWillUnMount() {
    const normsRef = fbase.child('rooms/' + this.context.roomId + '/norms')
    normsRef.off('child_added')
  }

  showNorm(norm) {
    return <li
      className={style.chooseNorm}
      key={norm.id}
      onClick={this.checkNorm(norm.id)}>
        <label className="c-input c-checkbox" >
          <input type="checkbox" checked={norm.checked}/>
          <span className={style.norm}>
           {norm.text}
          </span>
        </label>
      </li>
  }

  checkNorm(normId) {
    let self = this
    return function onClick(e) {
      e.preventDefault()
      // Need to setTimeout so that preventDefault doesn't break checkboxes
      // This is a React-recommended hack.
      setTimeout(function delayed() {
        self.setState(function setState(previousState) {
          previousState.norms[normId].checked = !previousState.norms[normId].checked
          return previousState
        })
      }, 1)
    }
  }

  preventDefault(e) {
    e.preventDefault()
  }

  remindOfNorms() {
    let self = this
    const modActionRef = fbase.child('mod_actions/')
    // TODO: Allow edits without breaking append-only rule (right now there's one modaction per comment)

    function isChecked(item) {
      return item.checked
    }

    let modAction = {
      action: 'warn',
      norms: this.state.norms.filter(isChecked),
      note: this.state.note,
      timestamp: new Date().getTime(),
      modId: this.context.nametagId,
      author: this.props.author.id,
    }

    function postComplete(err) {
      if (err) {
        self.setState({alert: 'Error posting reminder'})
        errorLog('Error putting mod Action')(err)
      } else {
        self.props.close()
      }
    }

    if (modAction.norms.length === 0) {
      self.setState({alert: 'Please check at least one norm.'})
      return
    }

    // Update firebase with modaction for the user.
    if (this.state.isPublic) {
      modActionRef.child(this.context.roomId +
        '/public/' + this.props.msgId + '/')
        .set(modAction, postComplete)
    } else {
      modActionRef.child(this.context.roomId +
        '/private/' + this.props.author.id + '/' +
        this.props.msgId + '/')
        .set(modAction, postComplete)
    }
  }

  setPublic(isPublic) {
    let self = this
    return function onClick() {
      self.setState({isPublic: isPublic})
    }
  }

  escalate() {
    this.setState({escalated: true})
  }

  removeUser() {
    // TODO: Add functionality to remove user.
  }

  addNote(e) {
    this.setState({note: e.target.value})
  }

  notifyBadge() {
    // TODO:Notify badge granters
  }

  render() {
    // TODO: I could add complexity here, cite multiple posts, etc.
    // TODO: Create a system for notifying badgeholders.
    let visText
    let alert
    if (this.state.alert) {
      alert = <Alert msg={this.state.alert} alertType="danger"/>
    }

    if (this.state.isPublic) {
      visText =
        <p>
          <span
            aria-hidden="true"
            className={style.visIcon + 'glyphicon glyphicon-eye-open'}>
          </span>
          Visible to everyone in the room.
        </p>
    } else {
      visText =
        <p>
          <span
          aria-hidden="true"
          className={style.visIcon + 'glyphicon glyphicon-eye-close'}>
          </span>
          Visible only to the author of this message.
        </p>
    }

    return <div id={style.modAction}>
        {alert}
        <span
          aria-hidden="true"
          className={style.close + ' glyphicon glyphicon-remove'}
          onClick={this.props.close.bind(this)}></span>
        <h4>Remind {this.props.author.name} of Conversation Norms</h4>
        <ul className={style.norms}>
        {this.state.norms.map(this.showNorm.bind(this))}
        </ul>
        <input
          type="text"
          className="form-control"
          onChange={this.addNote.bind(this)}
          placeholder="Add an optional note."
          value={this.state.message}/>
        <div className={style.chooseVis}>
          <div className={style.toggle} data-toggle="buttons">
            <label className={style.toggleOption + ' ' + (this.state.isPublic || style.active)}>
              <input
                type="radio"
                id="privateAction"
                onClick={this.setPublic(false).bind(this)} />
              Private
            </label>
            <label className={style.toggleOption + ' ' + (!this.state.isPublic || style.active)}>
              <input type="radio" id="publicAction" onClick={this.setPublic(true).bind(this)}/>
              Public
            </label>
          </div>
          <div className={style.visText}>
            {visText}
          </div>
        </div>
        <div className={style.modAction}>
          <button className={style.primary} onClick={this.remindOfNorms.bind(this)}>
            Remind
          </button>
          <button
            className={style.escalateLink + ' ' + (!this.state.escalated || style.hide)}
            onClick={this.escalate.bind(this)}>
              Escalate
          </button>
          <button
            className={style.danger + ' ' + (this.state.escalated || style.hide)}
            onClick={this.removeUser.bind(this)}>
              Remove {this.props.author.name} From Room
          </button>
          <button
            className={style.danger + ' ' + (this.state.escalated || style.hide)}
            onClick={this.notifyBadge.bind(this)}>
              Notify Badge Granters
          </button>
        </div>
        </div>
  }
}

ModAction.propTypes = {
  msgId: PropTypes.string,
  close: PropTypes.func,
  author: PropTypes.object }
ModAction.contextTypes = {
  nametagId: PropTypes.string,
  roomId: PropTypes.string,
}

export default ModAction
