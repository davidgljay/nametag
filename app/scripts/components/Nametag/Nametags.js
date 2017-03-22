import React from 'react'
import Nametag from './Nametag'
import {Card} from 'material-ui/Card'

const renderNametag = (nametag, mod) => {
  // Show whether the user is present.
  const cardStyle = nametag.present
  ? styles.nametag : {...styles.nametag, ...styles.absent}

  return <Card key={nametag.id} style={cardStyle}>
    <Nametag
      nametag={nametag}
      mod={mod} />
  </Card>
}

const Nametags = ({nametags, mod}) => <div style={styles.nametags}>
  {
    nametags.map((nametag) => renderNametag(nametag, mod))
  }
</div>

export default Nametags

const styles = {
  nametag: {
    width: 240,
    minHeight: 60,
    marginBottom: 5,
    paddingBottom: 5
  },
  absent: {
    opacity: 0.4
  },
  nametags: {
    marginBottom: 40
  }
}
