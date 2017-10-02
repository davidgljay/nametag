import React, {Component, PropTypes} from 'react'
import {withRouter} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import {red} from '../../../styles/colors'

class StartRoomForm extends Component {

  constructor (props) {
    super(props)

    this.state = {
      title: '',
      error: ''
    }

    this.onTitleChange = e => {
      e.preventDefault()
      this.setState({title: e.target.value, error: ''})
    }

    this.startRoom = () => {
      const {title} = this.state
      if (title) {
        this.props.router.push({
          pathname: `/rooms/create`,
          state: {title}
        })
      } else {
        this.setState({error: 'You must propose a topic of conversation.'})
      }
    }
  }

  render () {
    const {loggedIn} = this.props
    const {title, error} = this.state
    return <div style={loggedIn ? styles.loggedInContainer : {}}>
      <div style={styles.inputContainer}>
        <input
          type='text'
          id='convoInput'
          style={styles.input}
          value={title}
          placeholder='What would you like to talk about?'
          onChange={this.onTitleChange} />
        <div style={styles.error}>{error}</div>
      </div>
      <div style={styles.buttonContainer}>
        <RaisedButton
          id='startConvoButton'
          primary
          label={loggedIn ? 'Start Conversation' : 'Try It Out'}
          onClick={this.startRoom}
          />
      </div>
    </div>
  }
}

const {shape, func} = PropTypes

StartRoomForm.propTypes = {
  router: shape({
    push: func.isRequired
  }).isRequired
}

export default withRouter(StartRoomForm)

const styles = {
  loggedInContainer: {
    display: 'flex',
    maxWidth: 800,
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 15
  },
  inputContainer: {
    maxWidth: 800,
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 10
  },
  input: {
    flex: 1,
    fontSize: 20,
    padding: 10
  },
  error: {
    color: red,
    fontStyle: 'italic',
    fontSize: 12,
    margin: 10
  }
}
