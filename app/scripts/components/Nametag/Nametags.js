import React, { Component, PropTypes } from 'react'
import Nametag from './Nametag'
import {watchRoomNametags, unWatchRoomNametags} from '../../actions/NametagActions'
import {Card} from 'material-ui/Card'

class Nametags extends Component {

  componentDidMount() {
    this.props.dispatch(watchRoomNametags(this.props.room))
  }

  componentWillUnmount() {
    this.props.dispatch(unWatchRoomNametags(this.props.room))
  }

  render() {
    let nametags = []
    for (let id in this.props.nametags) {
      if (this.props.nametags[id].room === this.props.room) {
        nametags.push(this.props.nametags[id])
      }
    }

    nametags.sort(function sortnametags(a) {
      let score = -1
      if (a.mod) {
        score = 1
      }
      return score
    })

    function createNametag(nametag, mod) {
      // Make nametag.certificates an empty array if it not already assigned.
      nametag.certificates = nametag.certificates || []

      return <Card key={nametag.id} style={styles.nametag}>
        <Nametag
          name={nametag.name}
          bio={nametag.bio}
          icon={nametag.icon}
          id={nametag.id}
          certificates={nametag.certificates}
          mod={mod}/>
      </Card>
    }

    return <div style={styles.nametags}>
        {
          nametags.map((nametag) => {
            return createNametag(nametag, this.props.mod)
          })
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
  nametags: {
  	marginBottom: 40,
  },
}
