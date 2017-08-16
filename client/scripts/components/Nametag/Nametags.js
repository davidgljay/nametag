import React, {PropTypes} from 'react'
import Nametag from './Nametag'
import {Card} from 'material-ui/Card'

const Nametags = ({nametags, mod, myNametagId, setDefaultMessage, setRecipient, hideDMs}) =>
  <div id='nametags' style={styles.nametags}>
    {
      nametags.map((nametag) => {
        const cardStyle = nametag.present || nametag.id === myNametagId
        ? styles.nametag : {...styles.nametag, ...styles.absent}

        return <Card key={nametag.id} id={nametag.id === myNametagId && 'myNametag'} style={cardStyle}>
          <Nametag
            nametag={nametag}
            hideDMs={hideDMs}
            myNametagId={myNametagId}
            setRecipient={setRecipient}
            setDefaultMessage={setDefaultMessage}
            mod={mod} />
        </Card>
      })
    }
  </div>

const {arrayOf, string, object, func, bool} = PropTypes
Nametags.propTypes = {
  nametags: arrayOf(object).isRequired,
  mod: string.isRequired,
  myNametagId: string,
  hideDMs: bool,
  setDefaultMessage: func,
  setRecipient: func
}

export default Nametags

const styles = {
  nametag: {
    width: 240,
    minHeight: 60,
    marginBottom: 5,
    paddingBottom: 5
  },
  absent: {
    opacity: 0.8
  },
  nametags: {
    marginBottom: 40,
    display: 'flex',
    flexDirection: 'column'
  }
}
