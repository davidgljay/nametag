import React from 'react'
import Badges from '../Badge/Badges'
import FontIcon from 'material-ui/FontIcon'

const Nametag = ({id, mod, name, icon, bio, present, certificates}) => {
  let star = ''

  // Show if user is a mod.
  if (mod === id) {
    star = <FontIcon style={styles.ismod} className='material-icons'>star</FontIcon>
  }

  return <div
    key={name}
    style={styles.nametag}>
    {star}
    <img src={icon} alt={name} style={styles.icon} />
    <div style={styles.name}>{name}</div>
    <div style={styles.bio}>{bio}</div>
    <Badges certificates={certificates} />
  </div>
}

export default Nametag

const styles = {
  ismod: {
    float: 'right',
    fontSize: 20,
    cursor: 'default',
    marginRight: 10
  },
  bio: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRop: 5
  },
  icon: {
    float: 'left',
    margin: '3px 10px 3px 10px',
    width: 50,
    height: 50,
    borderRadius: 25
  },
  nametag: {
    padding: 5,
    minHeight: 55
  }
}
