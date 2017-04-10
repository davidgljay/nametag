import React, {PropTypes} from 'react'

const GranterInfo = ({granter: {name, image, description}}) =>
  <div id='granterInfo' style={styles.granterInfoContainer}>
    <img src={image} style={styles.granterImage} />
    <div id='granterDetails'>
      <h3 style={styles.name}>{name}</h3>
      <div style={styles.description}>{description}</div>
    </div>
  </div>

GranterInfo.propTypes = {
  granter: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    descriptions: PropTypes.string.isRequired
  }).isRequired
}

export default GranterInfo

const styles = {
  granterInfoContainer: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  granterImage: {
    width: 200,
    height: 200
  }
}
