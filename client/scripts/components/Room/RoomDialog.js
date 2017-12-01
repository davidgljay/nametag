import React, {PropTypes, Component} from 'react'
import Dialog from 'material-ui/Dialog'
import Login from '../../containers/User/LoginContainer'
import AboutNametag from './AboutNametag'
import WelcomeForm from './WelcomeForm'
import Norms from './Norms'
import RaisedButton from 'material-ui/RaisedButton'
import {getQueryVariable, removeQueryVar} from '../../utils/queryVars'
import t from '../../utils/i18n'
import {primary} from '../../../styles/colors'

class RoomDialog extends Component {

  constructor (props) {
    super(props)

    this.state = {
      intro: '',
      status: 'ABOUT',
      alreadyJoined: false
    }

    this.joinRoomFromQueryVar = () => {
      const {joinRoom, refetch} = this.props
      const intro = getQueryVariable('intro')
      removeQueryVar('intro')
      refetch().then(() => joinRoom(intro))
    }

    this.skipToLogin = e => {
      e.preventDefault()
      this.setState({status: 'LOGIN', alreadyJoined: true})
    }

    this.renderDialog = (status) => {
      const {
        createMessage,
        room,
        me,
        myNametag,
        updateNametagEdit,
        nametagEdits,
        joinRoom
      } = this.props

      const {alreadyJoined} = this.state
      let next
      switch (status) {
        case 'ABOUT':
          next = () => this.setState({status: 'NORMS'})
          return <div>
            <AboutNametag
              next={next} />
          </div>
        case 'NORMS':
          next = () => this.setState({status: 'WELCOME'})
          return <div style={styles.normsContainer}>
            <h3>Norms</h3>
            <Norms
              norms={room.norms}
              showChecks />
            <RaisedButton
              onClick={next}
              primary
              style={styles.normsButton}
              label={t('agree')} />
          </div>
        case 'WELCOME':
          next = () => this.setState({status: 'LOGIN'})
          return <WelcomeForm
            createMessage={createMessage}
            room={room}
            me={me}
            welcome={room.welcome}
            roomId={room.id}
            nametags={room.nametags}
            mod={room.mod}
            joinRoom={joinRoom}
            nametagEdit={nametagEdits[room.id]}
            myNametag={myNametag}
            updateNametagEdit={updateNametagEdit}
            onIntro={next} />
        case 'LOGIN':
          return <Login
            onLogin={this.joinRoomFromQueryVar}
            alert={t('room.choose_one')}
            buttonMsg={t('room.join')}
            message={alreadyJoined ? t('login.login') : t('room.create_account')} />
        default:
          return 'Something has gone wrong.'
      }
    }
  }

  componentDidMount () {
    const {me} = this.props
    if (me) {
      this.setState({status: 'NORMS'})
    }
  }

  render () {
    const {myNametag, me} = this.props
    const {status} = this.state

    return <div>
      <Dialog
        modal={false}
        contentStyle={styles.dialog}
        bodyStyle={styles.bodyStyle}
        open={!me || !myNametag || !myNametag.bio}
        onRequestClose={this.dismissWelcomeModal}>
        {this.renderDialog(status)}
        {
          status !== 'LOGIN' &&
          <div style={styles.alreadyJoined} onClick={this.skipToLogin}>
            {t('room.already_joined')}
          </div>
        }
      </Dialog>
    </div>
  }
}

const {arrayOf, shape, object, string, func} = PropTypes

RoomDialog.proptypes = {
  room: shape({
    id: string.isRequired,
    welcome: string.isRequired,
    nametags: arrayOf(object).isRequired,
    templates: arrayOf(shape({
      id: string.isRequired
    })),
    mod: object.isRequired
  }).isRequired,
  myNametag: shape({
    bio: string.isRequired
  }),
  me: object.isRequired,
  joinRoom: func.isRequired,
  refetch: func.isRequired,
  nametagEdits: object.isRequired,
  createNametag: func.isRequired,
  updateNametagEdit: func.isRequired,
  updateNametag: func.isRequired
}

export default RoomDialog

const styles = {
  dialog: {
    maxWidth: 820,
    width: 'fit-content',
    bottom: window.innerWidth < 800 ? '15vh' : 0
  },
  bodyStyle: {
    overflowY: 'auto'
  },
  normsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  normsButton: {
    marginTop: 30
  },
  alreadyJoined: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
    fontSize: 12,
    color: primary,
    cursor: 'pointer'
  }
}
