import React, {PropTypes} from 'react'
import {primary, white} from '../../../styles/colors'

const NametagIcon = ({image, name, diameter}) => {
  const imageStyle = {
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2
  }

  const defaultImageStyle = {
    ...styles.defaultImage,
    lineHeight: `#{diameter}px`,
    fontSize: diameter / 2
  }
  return <div>
    {
      image
      ? <img src={image} alt={name} style={imageStyle} />
      : <div style={{...imageStyle, ...defaultImageStyle}} >
        {name.slice(0, 2)}
      </div>
    }
  </div>
}

const {string, number} = PropTypes

NametagIcon.propTypes = {
  image: string.isRequired,
  name: string.isRequired,
  diameter: number.isRequired
}

export default NametagIcon

const styles = {
  defaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '50px',
    color: white
  }
}
