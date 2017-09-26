import React, {PropTypes, Component} from 'react'
import Nametag from '../Nametag/Nametag'
import {Card} from 'material-ui/Card'
import Compose from '../Message/Compose'

class WelcomeForm extends Component {

  constructor (props) {
    super(props)

    this.state = {
      bio: ''
    }

    this.onPost = (post) => {
      const {updateNametag, onWelcomeMsgSent, myNametag} = this.props
      updateNametag(myNametag.id, {bio: post})
      onWelcomeMsgSent()
    }

    this.onUpdateText = (bio) => this.setState({bio})
  }

  render () {
    const {
        createMessage,
        welcome,
        nametags,
        mod,
        defaultMessage,
        roomId,
        myNametag
      } = this.props

    return <div className='welcome'>
      <h3 style={styles.header}>{welcome}</h3>
      <Compose
        roomId={roomId}
        myNametag={myNametag}
        createMessage={createMessage}
        defaultMessage={defaultMessage}
        mod={mod}
        topic=''
        onPost={this.onPost}
        onUpdateText={this.onUpdateText}
        />
      <div style={styles.cardsContainer}>
        {
          nametags.map(nt => {
            const nametag = nt.id === myNametag.id ? {...nt, bio: this.state.bio} : nt
            return <Card key={nametag.id} id={nametag.id} style={styles.card}>
              <Nametag
                nametag={nametag}
                hideDMs
                myNametagId={myNametag.id}
                modId={mod.id} />
            </Card>
          }
          )
        }
      </div>
    </div>
  }
}

const {func, string, arrayOf, object, shape} = PropTypes

WelcomeForm.propTypes = {
  createMessage: func.isRequired,
  welcome: string.isRequired,
  onWelcomeMsgSent: func.isRequired,
  nametags: arrayOf(object),
  mod: object.isRequired,
  roomId: string.isRequired,
  updateNametag: func.isRequired,
  myNametag: shape({id: string.isRequired})
}

export default WelcomeForm

const styles = {
  header: {
    marginTop: 0
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
    overflowY: 'auto',
    paddingBottom: 30,
    marginTop: 20
  }
}
