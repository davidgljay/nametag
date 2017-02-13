import React, { Component, PropTypes } from 'react'
import Certificates from '../Certificate/Certificates'
import FontIcon from 'material-ui/FontIcon'

const styles = {
  ismod: {
    float: 'right',
    fontSize: 20,
    cursor: 'default',
    marginRight: 10
  },
  bio: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRop: 5
  },
  icon: {
    float: 'left',
    margin: '3px 10px 3px 10px',
    width: 50,
    height: 50,
    borderRadius: 25
  },
  nametag: {
    padding: 5,
    minHeight: 55
  }
}

class Nametag extends Component {

  constructor (props) {
    super(props)

    this.propTypes = {
      id: PropTypes.string,
      mod: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.string,
      bio: PropTypes.string,
      present: PropTypes.bool,
      certificates: PropTypes.array
    }
  }

  render () {
    let star = ''

    // Show if user is a mod.
    if (this.props.mod === this.props.id) {
      star = <FontIcon style={styles.ismod} className='material-icons'>star</FontIcon>
    }

    return <div
      key={this.props.name}
      style={styles.nametag}>
      {star}
      <img src={this.props.icon} alt={this.props.name} style={styles.icon} />
      <div style={styles.name}>{this.props.name}</div>
      <div style={styles.bio}>{this.props.bio}</div>
      <Certificates certificates={this.props.certificates} />
    </div>
  }
}

export default Nametag
