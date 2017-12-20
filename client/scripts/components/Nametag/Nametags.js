import React, {PropTypes} from 'react'
import Nametag from './Nametag'
import {Card} from 'material-ui/Card'

const Nametags = ({
  nametags,
  mod,
  myNametagId,
  setDefaultMessage,
  setRecipient,
  setBadgeGrantee,
  canGrantBadges,
  toggleNametagImageMenu,
  hideDMs
}) =>
  <div id='nametags' style={styles.nametags}>
    {
      nametags
      .filter(nametag => !nametag.banned)
      .map((nametag) =>
        <Card key={nametag.id} id={nametag.id === myNametagId && 'myNametag'} style={styles.nametag}>
          <Nametag
            nametag={nametag}
            hideDMs={hideDMs}
            myNametagId={myNametagId}
            canGrantBadges={canGrantBadges}
            setRecipient={setRecipient}
            setDefaultMessage={setDefaultMessage}
            setBadgeGrantee={setBadgeGrantee}
            toggleNametagImageMenu={toggleNametagImageMenu}
            modId={mod} />
        </Card>)
    }
  </div>

const {arrayOf, string, object, func, bool} = PropTypes
Nametags.propTypes = {
  nametags: arrayOf(object).isRequired,
  mod: string.isRequired,
  canGrantBadges: bool.isRequired,
  toggleNametagImageMenu: func.isRequired,
  myNametagId: string,
  hideDMs: bool,
  setDefaultMessage: func,
  setRecipient: func,
  setBadgeGrantee: func
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
