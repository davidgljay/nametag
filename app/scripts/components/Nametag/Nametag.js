import React, {PropTypes} from 'react'
import Badges from '../Badge/Badges'
import FontIcon from 'material-ui/FontIcon'
import {dateFormat} from '../Utils/DateFormat'
import {primary, white} from '../../../styles/colors'

const Nametag = ({mod, nametag: {id, name, image, bio, present, badges}}) => {
  let ismod = ''

  // Show if user is a mod.
  if (mod === id) {
    ismod = <div style={styles.ismod}>Host</div>
  }

  return <div
    key={id}
    style={styles.nametag}>
    <div style={styles.main}>
      {
        image
        ? <img src={image} alt={name} style={styles.image} />
      : <div style={{...styles.image, ...styles.defaultImage}}>{name.slice(0, 2)}</div>
      }
      <div style={styles.details}>
        <div style={styles.name}>{name}</div>
        <div style={styles.bio}>{bio}</div>
      </div>
      {ismod}
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
    image: string.isRequired,
    bio: string,
    present: bool,
    badges: arrayOf(object).isRequired
  }).isRequired
}

export default Nametag

const styles = {
  ismod: {
    fontSize: 12,
    fontStyle: 'italic',
    margin: 3,
    cursor: 'default'
  },
  details: {
    flex: 1,
    cursor: 'default'
  },
  bio: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5
  },
  image: {
    float: 'left',
    margin: '3px 10px 3px 10px',
    width: 50,
    height: 50,
    borderRadius: 25
  },
  defaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '50px',
    fontSize: 22,
    color: white,
    cursor: 'default'
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
