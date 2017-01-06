import React, { Component, PropTypes } from 'react'
import errorLog from '../../utils/errorLog'
import VisOptions from './VisibilityOptions'
import ModActionButtons from './ModActionButtons'
import Alert from '../Utils/Alert'
import { Card } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import {List, ListItem} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'

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
    return <ListItem
        leftCheckbox={<Checkbox checked={this.state.normChecks[i]}/>}
        primaryText={norm}
        key={i}
        onClick={this.checkNorm(i)}>
      </ListItem>
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

    return <Card style={styles.modAction}>
      <IconButton
        style={styles.closeButton}
        onClick={this.props.close}>
        <FontIcon
          className='material-icons'>
          close
        </FontIcon>
      </IconButton>
      <h4 style={styles.title}>Remind {this.props.author.name} of Conversation Norms</h4>
      <List>
        {this.context.norms.map(this.showNorm)}
      </List>
      <TextField
        style={styles.addNote}
        onChange={this.addNote}
        hintText="Add an optional note."
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
  }
}

ModAction.propTypes = {
  msgId: PropTypes.string,
  close: PropTypes.func,
  author: PropTypes.object,
  postMessage: PropTypes.func.isRequired,
}
ModAction.contextTypes = {
  room: PropTypes.string,
  norms: PropTypes.array,
}

export default ModAction

const styles = {
  title: {
    marginLeft: 20,
  },
  addNote: {
    width: 'inherit',
    display: 'block',
  },
  modAction: {
    maxWidth: 500,
    borderRadius: 6,
    padding: 10,
    marginTop: 20,
  },
  closeButton: {
    float: 'right',
    padding: 0,
    height: 'auto',
  },
}
