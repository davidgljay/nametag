import React, {PropTypes} from 'react'
import Badges from '../Badge/Badges'
import FontIcon from 'material-ui/FontIcon'

const Nametag = ({mod, nametag: {id, name, icon, bio, present, badges}}) => {
  let star = ''

  // Show if user is a mod.
  if (mod === id) {
    star = <FontIcon style={styles.ismod} className='material-icons'>star</FontIcon>
  }

  return <div
    key={id}
    style={styles.nametag}>
    {star}
    <img src={icon} alt={name} style={styles.icon} />
    <div style={styles.name}>{name}</div>
    <div style={styles.bio}>{bio}</div>
    <Badges badges={badges} />
  </div>
}

Nametag.PropTypes = {
  mod: PropTypes.string,
  nametag: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    bio: PropTypes.string,
    present: PropTypes.bool,
    badges: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired
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
