import React, { Component, PropTypes } from 'react'
import errorLog from '../../utils/errorLog'
import style from '../../../styles/ModAction/ModAction.css'
import VisOptions from './VisibilityOptions'
import ModActionButtons from './ModActionButtons'
import Alert from '../Utils/Alert'
import { Card, CardMenu, Grid, Cell, IconButton } from 'react-mdl'

class ModAction extends Component {
  constructor(props) {
    super(props)
    this.state = {
      normChecks: [],
      isPublic: false,
      text: '',
      escalated: false,
    }
    this.showNorm = this.showNorm.bind(this)
    this.checkNorm = this.checkNorm.bind(this)
    this.addNote = this.addNote.bind(this)
    this.remindOfNorms = this.remindOfNorms.bind(this)
    this.setPublic = this.setPublic.bind(this)
    this.escalate = this.escalate.bind(this)
  }

  showNorm(norm, i) {
    return <li
      className={style.chooseNorm}
      key={i}
      onClick={this.checkNorm(i)}>
        <label className="c-input c-checkbox" >
          <input type="checkbox" checked={this.state.normChecks[i]}/>
          <span className={style.norm}>
           {norm}
          </span>
        </label>
      </li>
  }

  checkNorm(normIndex) {
    let self = this
    return (e) => {
      e.preventDefault()
      // Need to setTimeout so that preventDefault doesn't break checkboxes
      // This is a React-recommended hack.
      setTimeout(() => {
        self.setState((previousState) => {
          previousState.normChecks[normIndex] = !previousState.normChecks[normIndex]
          return previousState
        })
      }, 1)
    }
  }

  preventDefault(e) {
    e.preventDefault()
  }

  remindOfNorms() {
    // TODO: Allow edits without breaking append-only rule (right now there's one modaction per comment)

    if (this.state.normChecks.length === 0) {
      self.setState({alert: 'Please check at least one norm.'})
      return
    }

    let modAction = {
      type: 'modAction',
      action: 'warn',
      norms: this.context.norms.filter((item) => item.checked),
      text: this.state.text,
      timestamp: new Date().getTime(),
      modId: this.context.nametagId,
      author: this.props.author.id,
    }

    this.props.postMessage(modAction)
      .then(() => {
        self.props.close()
      },
      (err) => {
        this.setState({alert: 'Error posting reminder'})
        errorLog('Error putting mod Action')(err)
      })
  }

  setPublic(isPublic) {
    return (e) => {
      e.preventDefault()
      this.setState({isPublic})
    }
  }

  escalate() {
    this.setState({escalated: true})
  }

  removeUser() {
    // TODO: Add functionality to remove user.
  }

  censorMessage() {
    // TODO: Add functionality to censor a message
  }

  addNote(e) {
    e.preventDefault
    this.setState({text: e.target.value})
  }

  notifyBadge() {
    // TODO:Notify badge granters
  }

  render() {
    // TODO: I could add complexity here, cite multiple posts, etc.
    // TODO: Create a system for notifying badgeholders.
    let alert
    if (this.state.alert) {
      alert = <Alert msg={this.state.alert} alertType="danger"/>
    }

    return <Grid>
      <Cell col={8}>
        <Card className={style.modAction} shadow={1}>
          {alert}
          <CardMenu>
            <IconButton
              name='close'
              onClick={this.props.close}/>
          </CardMenu>
          <h4>Remind {this.props.author.name} of Conversation Norms</h4>
          <ul className={style.norms}>
          {this.context.norms.map(this.showNorm)}
          </ul>
          <input
            type="text"
            className="form-control"
            onChange={this.addNote}
            placeholder="Add an optional note."
            value={this.state.message}/>
          <VisOptions
            isPublic = {this.state.isPublic}
            setPublic = {this.setPublic}/>
          <ModActionButtons
            escalate = {this.escalate}
            escalated = {this.state.escalated}
            remindOfNorms = {this.remindOfNorms}
            removeUser = {this.removeUser}
            notifyBadge = {this.notifyBadge}
            authorName = {this.props.author.name}
            censorMessage = {this.censorMessage}
            />
        </Card>
      </Cell>
    </Grid>
  }
}

ModAction.propTypes = {
  msgId: PropTypes.string,
  close: PropTypes.func,
  author: PropTypes.object,
  postMessage: PropTypes.func.isRequired,
}
ModAction.contextTypes = {
  userNametag: PropTypes.string,
  room: PropTypes.string,
  norms: PropTypes.array,
}

export default ModAction
