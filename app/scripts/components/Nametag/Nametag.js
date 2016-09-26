import React, { Component, PropTypes } from 'react'
import Certificates from '../Certificate/Certificates'
import FontIcon from 'material-ui/FontIcon'

const styles = {
  ismod: {
    float: 'right',
    fontSize: 20,
    cursor: 'default',
    marginRight: 10,
  },
  bio: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRop: 5,
  },
  icon: {
    float: 'left',
    margin: '3px 10px 3px 10px',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nametag: {
    padding: 5,
  },
}


class Nametag extends Component {
  componentWillMount() {
    if (!this.props.name) {
      this.props.watchNametag(this.props.id)
    }
  }

  componentDidUnMount() {
    this.props.unWatchNametag(this.props.id)
  }

  render() {
    let star = ''

    // Show if user is a mod.
    if (this.props.mod === this.props.id) {
      star = <FontIcon style={styles.ismod} className='material-icons'>star</FontIcon>
    }

    return <div key={this.props.name} style={styles.nametag}>
        {star}
        <img src={this.props.icon} alt={this.props.name} style={styles.icon}/>
        <div style={styles.name}>{this.props.name}</div>
        <div style={styles.bio}>{this.props.bio}</div>
        <Certificates certificates={this.props.certificates} />
      </div>
  }
}

Nametag.propTypes = {
  id: PropTypes.string,
  room: PropTypes.string,
}

export default Nametag
