import React, {PropTypes} from 'react'
import {Card, CardMedia, CardTitle} from 'material-ui/Card'

const FeatureCallout = ({title, image, body}) => <div>
  <Card style={styles.card}>
    <CardMedia
      overlayContentStyle={styles.overlayStyle} >
      <img src={image} alt='' />
    </CardMedia>
    <CardTitle
      title={title}
      titleStyle={styles.titleStyle}
      subtitle={body}
      subtitleStyle={styles.subtitleStyle} />
  </Card>
</div>

const {string} = PropTypes

FeatureCallout.proptypes = {
  title: string.isRequired,
  image: string.isRequired,
  body: string.isRequired
}

export default FeatureCallout

const styles = {
  card: {
    width: 260,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 3,
    marginRight: 3
  },
  titleStyle: {
    fontWeight: 300
  },
  overlayStyle: {
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 20%)'
  }
}
