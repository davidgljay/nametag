import React, {Component, PropTypes} from 'react'
import Navbar from '../Utils/Navbar'
import RaisedButton from 'material-ui/RaisedButton'
import t from '../../utils/i18n'

class Unsubscribe extends Component {

  constructor (props) {
    super(props)

    this.state = {
      unsubscribed: false
    }

    this.unsubscribeClick = (roomId) => e => {
      e.preventDefault()
      const {unsubscribe, params: {userToken}} = this.props
      unsubscribe(userToken, roomId)
        .then(() => this.setState({unsubscribed: true}))
    }

    this.getQueryVariable = (variable) => {
      let query = window.location.search.substring(1)
      let vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (decodeURIComponent(pair[0]) === variable) {
          return decodeURIComponent(pair[1])
        }
      }
    }
  }

  render () {
    const roomName = decodeURIComponent(this.getQueryVariable('roomname'))
    const roomId = this.getQueryVariable('roomid')
    return <div id='unsubscribe'>
      <Navbar empty />
      {
        this.state.unsubscribed
        ? <div style={styles.container}>
          <h2 style={styles.header}>{t('user.unsubscribed')}</h2>
        </div>
        : <div style={styles.container}>
          <h2 style={styles.header}>{t('user.unsub', roomName)}</h2>
          <RaisedButton
            id='unsubscribeButton'
            primary
            labelStyle={styles.button}
            onClick={this.unsubscribeClick(roomId)}
            label={t('user.unsub_label')} />
          <div style={styles.allText}>
            {t('user.unsub_text')} <a href='#' style={styles.allLink} onClick={this.unsubscribeClick('all')}>{t('user.unsub_link')}</a>{t('user.unsub_text_2')}.
          </div>
        </div>
      }
    </div>
  }
}

const {func} = PropTypes

Unsubscribe.propTypes = {
  unsubscribe: func.isRequired
}

export default Unsubscribe

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  button: {
    fontSize: 18
  },
  allText: {
    color: 'grey',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 30,
    width: 250
  },
  allLink: {
    color: 'grey'
  },
  header: {
    marginTop: '20vh',
    marginBottom: 40
  }
}
