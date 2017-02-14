import React from 'react'
import Nametag from './Nametag'
import {Card} from 'material-ui/Card'

const renderNametag = (nametag, mod) => {
  // Make nametag.certificates an empty array if it not already assigned.
  nametag.certificates = nametag.certificates || []

  // Show whether the user is present.
  const cardStyle = nametag.present
  ? styles.nametag : {...styles.nametag, ...styles.absent}

  return <Card key={nametag.id} style={cardStyle}>
    <Nametag
      name={nametag.name}
      bio={nametag.bio}
      icon={nametag.icon}
      id={nametag.id}
      certificates={nametag.certificates}
      mod={mod} />
  </Card>
}

const Nametags = ({nametags = {}, room, mod}) => {
  const nametagList = Object.keys(nametags)
    .reduce((p, id) => p.concat(nametags[id]), [])
    .filter((n) => n.room === room)
    .sort((a, b) =>
      a.present &&
      !b.present ? -1 : 1
    )

  return <div style={styles.nametags}>
    {
        nametagList.map((nametag) => renderNametag(nametag, mod))
      }
  </div>
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
    opacity: 0.4
  },
  nametags: {
    marginBottom: 40
  }
}
