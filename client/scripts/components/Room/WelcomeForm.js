import React, {PropTypes} from 'react'
import Nametag from '../Nametag/Nametag'
import {Card} from 'material-ui/Card'
import Compose from '../Message/Compose'

const onPost = (updateNametag, onWelcomeMsgSent, myNametagId) => (post) => {
  updateNametag(myNametagId, {bio: post})
  onWelcomeMsgSent()
}

const WelcomeForm = ({
  createMessage,
  welcome,
  nametags,
  mod,
  defaultMessage,
  roomId,
  myNametag,
  updateNametag,
  onWelcomeMsgSent
}) =>
  <div className='welcome'>
    <h3>{welcome}</h3>
    <Compose
      roomId={roomId}
      myNametag={myNametag}
      createMessage={createMessage}
      defaultMessage={defaultMessage}
      mod={mod}
      topic=''
      onPost={onPost(updateNametag, onWelcomeMsgSent, myNametag.id)}
      />
    <div style={styles.cardsContainer}>
      {
        nametags.map(nametag =>
          <Card key={nametag.id} id={nametag.id} style={styles.card}>
            <Nametag
              nametag={nametag}
              hideDMs
              myNametagId={myNametag.id}
              modId={mod.id} />
          </Card>
        )
      }
    </div>
  </div>

const {func, string, arrayOf, object, shape} = PropTypes

WelcomeForm.propTypes = {
  createMessage: func.isRequired,
  welcome: string.isRequired,
  onWelcomeMsgSent: func.isRequired,
  nametags: arrayOf(object).isRequired,
  mod: object.isRequired,
  roomId: string.isRequired,
  updateNametag: func.isRequired,
  myNametag: shape({id: string.isRequired}).isRequired
}

export default WelcomeForm

const styles = {
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
