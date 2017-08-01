import React, {PropTypes} from 'react'
import {primary, white} from '../../../styles/colors'

const NametagIcon = ({image, name, diameter, marginRight, style = {}}) => {
  const imageStyle = {
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2,
    ...style
  }

  const defaultImageStyle = {
    ...styles.defaultImage,
    lineHeight: `${diameter}px`,
    fontSize: diameter / 2,
    ...style
  }
  return <div style={{marginRight}}>
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
  image: string,
  name: string.isRequired,
  diameter: number.isRequired,
  marginRight: number
}

export default NametagIcon

const styles = {
  defaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    color: white,
    cursor: 'inherit'
  }
}
