import React, {PropTypes, Component} from 'react'
import Nametag from '../Nametag/Nametag'
import {Card} from 'material-ui/Card'
import Compose from '../Message/Compose'
import EditNametag from '../Nametag/EditNametag'
import {track, setTimer, increment} from '../../utils/analytics'
import t from '../../utils/i18n'

class WelcomeForm extends Component {

  constructor (props) {
    super(props)

    this.state = {
      bio: ''
    }

    this.onPost = (post) => {
      const {onIntro, joinRoom, me} = this.props
      if (!post) {
        return
      }
      if (!me) {
        onIntro()
        track('PRE_LOGIN_WELCOME_POST')
        history.pushState('', document.title, `${window.location.pathname}?intro=${encodeURIComponent(post)}`)
      } else {
        track('WELCOME_POST')
        increment('ROOMS_POSTED')
        joinRoom(post)
      }
    }

    this.onUpdateText = (bio) => this.setState({bio})
  }

  componentDidMount () {
    setTimer('WELCOME_POST')
  }

  render () {
    const {
        room: {
          welcome,
          id,
          nametags,
          mod,
          templates
        },
        me,
        defaultMessage,
        myNametag,
        nametagEdit = {},
        updateNametagEdit
      } = this.props

    return <div className='welcome'>
      {
        me && <EditNametag
          nametagEdit={nametagEdit}
          me={me}
          requiredTemplates={templates}
          updateNametagEdit={updateNametagEdit}
          roomId={id} />
      }
      <h3 style={styles.header}>{welcome}</h3>
      <Compose
        roomId={id}
        myNametag={myNametag}
        createMessage={() => {}}
        defaultMessage={defaultMessage}
        mod={mod}
        topic=''
        hintText={t('room.introduce')}
        onPost={this.onPost}
        onUpdateText={this.onUpdateText}
        />
      <div style={styles.cardsContainer}>
        {
          nametags.map(nt => {
            const nametag = myNametag && nt.id === myNametag.id
              ? {...nt, bio: this.state.bio} : nt
            return <Card key={nametag.id} id={nametag.id} style={styles.card}>
              <Nametag
                nametag={nametag}
                hideDMs
                modId={mod.id} />
            </Card>
          })
        }
      </div>
    </div>
  }
}

const {func, string, arrayOf, object, shape} = PropTypes

WelcomeForm.propTypes = {
  room: shape({
    id: string.isRequired,
    welcome: string.isRequired,
    templates: arrayOf(object).isRequired,
    mod: object.isRequired,
    nametags: arrayOf(object)
  }),
  updateNametagEdit: func.isRequired,
  onIntro: func.isRequired,
  nametagEdit: object,
  myNametag: shape({id: string.isRequired})
}

export default WelcomeForm

const styles = {
  header: {
    marginTop: 0,
    fontWeight: 300
  },
  card: {
    width: 240,
    minHeight: 60,
    margin: 5,
    padding: 5
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '50vh',
    paddingBottom: 30,
    marginTop: 20
  }
}
