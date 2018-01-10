import React, {Component, PropTypes} from 'react'
import {withRouter} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import {red} from '../../../styles/colors'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'
import t from '../../utils/i18n'

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
      console.log('Starting room creation')
      if (title) {
        this.props.router.push({
          pathname: `/rooms/create`,
          state: {title}
        })
      } else {
        this.setState({error: t('room.room_form_err')})
      }
    }
  }

  render () {
    const {loggedIn} = this.props
    const {title, error} = this.state
    return <div style={loggedIn ? styles.loggedInContainer : {}}>
      <form style={styles.inputContainer} onSubmit={this.startRoom}>
        <input
          type='text'
          id='convoInput'
          style={styles.input}
          value={title}
          placeholder={t('room.room_form')}
          onChange={this.onTitleChange} />
        <div style={styles.error}>{error}</div>
      </form>
      <div style={styles.buttonContainer}>
        <RaisedButton
          id='startConvoButton'
          primary
          style={styles.button}
          label={loggedIn ? t('room.start_conversation') : t('room.try_it')}
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

export default withRouter(radium(StartRoomForm))

const styles = {
  loggedInContainer: {
    display: 'flex',
    maxWidth: 800,
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    [mobile]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 15
  },
  inputContainer: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: 80,
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
