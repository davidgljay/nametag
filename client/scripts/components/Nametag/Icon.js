import React, {PropTypes} from 'react'
import {primary, white} from '../../../styles/colors'

const Icon = ({image, name, onClick, diameter}) => {
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
      ? <img src={image} alt={name} style={imageStyle} onClick={onClick} />
      : <div style={{...imageStyle, ...defaultImageStyle}} onClick={onClick}>
        {name.slice(0, 2)}
      </div>
    }
  </div>
}

const {string, number, func} = PropTypes

Icon.propTypes = {
  image: string.isRequired,
  name: string.isRequired,
  diameter: number.isRequired,
  onClick: func.isRequired
}

export default Icon

const styles = {
  defaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '50px',
    color: white,
    cursor: 'default'
  }
}
