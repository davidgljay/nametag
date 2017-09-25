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
    const {title, error} = this.state
    return <div>
      <div style={styles.inputContainer}>
        <input
          type='text'
          id='convoInput'
          style={styles.input}
          value={title}
          placeholder='What would you like to talk about?'
          onChange={this.onTitleChange} />
      </div>
      <div style={styles.buttonContainer}>
        <div style={styles.error}>{error}</div>
        <RaisedButton
          primary
          label='Try It Out'
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  inputContainer: {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    padding: 10
  },
  input: {
    flex: 1,
    fontSize: 20,
    padding: 10
  },
  error: {
    color: 'red',
    fontStyle: 'italic',
    fontSize: 12,
    margin: 10
  }
}
