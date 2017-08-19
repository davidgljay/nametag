import React, { Component, PropTypes } from 'react'
import Login from '../../containers/User/LoginContainer'
import RaisedButton from 'material-ui/RaisedButton'
import Alert from '../Utils/Alert'

class Join extends Component {

  constructor (props) {
    super(props)

    this.state = {alert: null}

    this.onJoinClick = () => {
      const {room} = this.props
      window.location = `/rooms/${room}`
    }
  }

  render () {
    let join
    const {me} = this.props
    if (me) {
      join =
        <div style={styles.join}>
          <Alert alert={this.state.alert} />
          <RaisedButton
            id='joinRoomButton'
            primary
            labelStyle={styles.button}
            onClick={this.onJoinClick}
            label='JOIN' />
        </div>
    } else {
      join = <Login />
    }
    return join
  }
}

const {object} = PropTypes

Join.propTypes = {
  room: object,
  me: object
}

export default Join

const styles = {
  join: {
    textAlign: 'center',
    paddingTop: 20
  },
  button: {
    color: '#fff',
    fontWeight: 'bold'
  }
}
