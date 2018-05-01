import React, {PropTypes} from 'react'

const Embed = ({data: {rooms}}) => <div>{rooms}</div>

const {array, shape, bool, object, string, func} = PropTypes

Embed.proptypes = {

}

export default Embed
