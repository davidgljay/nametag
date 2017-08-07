import React, {PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'
import Nametag from '../Nametag/Nametag'
import {Card} from 'material-ui/Card'
import Compose from '../Message/Compose'

const onPost = (updateNametag, toggleWelcome, myNametagId) => (post) => {
  updateNametag(myNametagId, {bio: post})
  toggleWelcome()
}

const WelcomeModal = ({
  createMessage,
  welcome,
  nametags,
  mod,
  defaultMessage,
  roomId,
  myNametag,
  showWelcome,
  toggleWelcome,
  updateNametag
}) =>
  <Dialog
    modal={false}
    contentStyle={styles.dialog}
    open={showWelcome}
    onRequestClose={() => toggleWelcome()}>
    <h3>{welcome}</h3>
    <Compose
      roomId={roomId}
      myNametag={myNametag}
      createMessage={createMessage}
      defaultMessage={defaultMessage}
      mod={mod}
      topic=''
      onPost={onPost(updateNametag, myNametag.id)}
      />
    <div style={styles.cardsContainer}>
      {
        nametags.map(nametag =>
          <Card key={nametag.id} id={nametag.id} style={styles.card}>
            <Nametag
              nametag={nametag}
              hideDMs
              myNametagId={myNametag.id}
              mod={mod}
              />
          </Card>
        )
      }
    </div>
  </Dialog>

const {func, string, arrayOf, object, bool, shape} = PropTypes

WelcomeModal.propTypes = {
  createMessage: func.isRequired,
  welcome: string.isRequired,
  showWelcome: bool.isRequired,
  toggleWelcome: func.isRequired,
  nametags: arrayOf(object).isRequired,
  mod: object.isRequired,
  roomId: string.isRequired,
  updateNametag: func.isRequired,
  myNametag: shape({id: string.isRequired}).isRequired
}

export default WelcomeModal

const styles = {
  dialog: {
    maxWidth: 800
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
