import React, {PropTypes} from 'react'
import {white} from '../../../styles/colors'

const FeatureCallout = ({title, image, body}) =>
  <div style={styles.container}>
    <img src={image} alt={''} style={styles.image} />
    <h3 style={styles.titleStyle}>
      {title}
    </h3>
    <div style={styles.bodyStyle}>
      {body}
    </div>
  </div>

const {string} = PropTypes

FeatureCallout.proptypes = {
  title: string.isRequired,
  image: string.isRequired,
  body: string.isRequired
}

export default FeatureCallout

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: white,
    width: 350,
    padding: 10
  },
  image: {
    height: 200
  },
  titleStyle: {
    fontWeight: 300,
    fontSize: 24
  },
  bodyStyle: {
    textAlign: 'center'
  }
}
