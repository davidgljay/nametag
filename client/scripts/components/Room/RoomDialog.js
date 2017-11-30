import React, {PropTypes, Component} from 'react'
import Dialog from 'material-ui/Dialog'
import Login from '../../containers/User/LoginContainer'
import RaisedButton from 'material-ui/RaisedButton'
import WelcomeForm from './WelcomeForm'
import {getQueryVariable, removeQueryVar} from '../../utils/queryVars'
import t from '../../utils/i18n'

class RoomDialog extends Component {

  constructor (props) {
    super(props)

    this.state = {
      intro: '',
      status: 'ABOUT'
    }

    this.joinRoomFromQueryVar = () => {
      const {joinRoom} = this.props
      const intro = getQueryVariable('intro')
      removeQueryVar('intro')
      joinRoom(intro)
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
      let next
      switch (status) {
        case 'ABOUT':
          next = () => this.setState({status: 'WELCOME'})
          return <div>
            <h1>About Nametag</h1>
            <RaisedButton
              primary
              onClick={next}
              label='Next' />
          </div>
        case 'WELCOME':
          next = () => {
            this.setState({status: 'LOGIN'})
          }
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
            message={t('room.create_account')} />
        default:
          return 'Something has gone wrong.'
      }
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
  }
}
