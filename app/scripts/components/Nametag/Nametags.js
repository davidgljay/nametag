import React, { Component, PropTypes } from 'react'
import Nametag from './Nametag'
import {watchRoomNametags, unWatchRoomNametags} from '../../actions/NametagActions'
import {Card} from 'material-ui/Card'
import _ from 'lodash'

class Nametags extends Component {

  componentDidMount() {
    this.props.dispatch(watchRoomNametags(this.props.room))
  }

  componentWillUnmount() {
    this.props.dispatch(unWatchRoomNametags(this.props.room))
  }

  createNametag = (nametag, mod) => {
    // Make nametag.certificates an empty array if it not already assigned.
    nametag.certificates = nametag.certificates || []

    // Show whether the user is present.
    const cardStyle = nametag.present ?
      styles.nametag : {...styles.nametag, ...styles.absent}

    return <Card key={nametag.id} style={cardStyle}>
      <Nametag
        name={nametag.name}
        bio={nametag.bio}
        icon={nametag.icon}
        id={nametag.id}
        certificates={nametag.certificates}
        mod={mod}/>
    </Card>
  }

  render() {
    let nametags = []
    for (let id in this.props.nametags) {
      if (this.props.nametags[id].room === this.props.room) {
        nametags.push(this.props.nametags[id])
      }
    }

    return <div style={styles.nametags}>
        {
          nametags.sort((a, b) =>
            a.present &&
            !b.present ? 0 : 1
          ).map((nametag) => this.createNametag(nametag, this.props.mod))
        }
      </div>
  }
}

Nametags.propTypes = { room: PropTypes.string, mod: PropTypes.string }

export default Nametags

const styles = {
  nametag: {
    width: 240,
    minHeight: 60,
    marginBottom: 5,
    paddingBottom: 5,
  },
  absent: {
    opacity: 0.4,
  },
  nametags: {
    marginBottom: 40,
  },
}
