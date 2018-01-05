import React, {PropTypes} from 'react'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'

const GranterInfo = ({granter: {name, image, description, stripe, urlCode}, me: {email}}) =>
  <div id='granterInfo' style={styles.granterInfoContainer}>
    <img src={image} style={styles.granterImage} />
    <div id='granterDetails' style={styles.granterDetails}>
      <h1 style={styles.name}>{name}</h1>
      <div style={styles.description}>{description}</div>
    </div>
  </div>

GranterInfo.propTypes = {
  granter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
}

export default radium(GranterInfo)

const styles = {
  granterInfoContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 40,
    [mobile]: {
      alignItems: 'center',
      flexDirection: 'column'
    },
    marginTop: 30
  },
  granterImage: {
    width: 200
  },
  description: {
    fontSize: 20
  },
  granterDetails: {
    marginLeft: 30,
    width: '100%'
  }
}
