import React, { Component, PropTypes } from 'react'
import {withRouter} from 'react-router'
import Login from '../../containers/User/LoginContainer'
import RaisedButton from 'material-ui/RaisedButton'
import Alert from '../Utils/Alert'
import t from '../../utils/i18n'

class Join extends Component {

  constructor (props) {
    super(props)

    this.state = {alert: null}

    this.onJoinClick = () => {
      const {room, router} = this.props
      router.push({
        pathname: `/rooms/${room}`,
        state: {isJoining: true}
      })
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
            label={t('room.join')} />
        </div>
    } else {
      join = <Login />
    }
    return join
  }
}

const {object, string} = PropTypes

Join.propTypes = {
  room: string,
  me: object
}

export default withRouter(Join)

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
