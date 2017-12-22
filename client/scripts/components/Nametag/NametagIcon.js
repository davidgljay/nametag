import React, {PropTypes} from 'react'
import {primary, white} from '../../../styles/colors'

const colorFromString = (string) => {
  let hash = 0
  for (var i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  var c = (hash & 0x00FFFFFF)
     .toString(16)
     .toUpperCase()

  return '00000'.substring(0, 6 - c.length) + c
}

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
    backgroundColor: `#${colorFromString(name)}`,
    ...style
  }

  return <div style={{marginRight}}>
    {
      image
      ? <div alt={name} style={{
        ...imageStyle,
        background: `url(${image}) center center / cover no-repeat`
      }} />
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
