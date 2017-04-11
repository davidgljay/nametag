import React, {PropTypes} from 'react'
import Badges from '../Badge/Badges'
import FontIcon from 'material-ui/FontIcon'
import {dateFormat} from '../Utils/DateFormat'

const Nametag = ({mod, nametag: {id, name, icon, bio, present, badges}}) => {
  let star = ''

  // Show if user is a mod.
  if (mod === id) {
    star = <FontIcon style={styles.ismod} className='material-icons'>star</FontIcon>
  }

  return <div
    key={id}
    style={styles.nametag}>
    <div style={styles.main}>
      {star}
      <img src={icon} alt={name} style={styles.icon} />
      <div style={styles.details}>
        <div style={styles.name}>{name}</div>
        <div style={styles.bio}>{bio}</div>
      </div>
    </div>
    <Badges badges={badges} />
  </div>
}

const {string, shape, arrayOf, bool, object} = PropTypes

Nametag.PropTypes = {
  mod: string,
  nametag: shape({
    id: string.isRequired,
    name: string.isRequired,
    icon: string.isRequired,
    bio: string,
    present: bool,
    badges: arrayOf(object).isRequired
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
  },
  main: {
    display: 'flex'
  },
  noteText: {
    fontSize: 14,
    margin: 5
  }
}
