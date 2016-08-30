import React, { Component, PropTypes } from 'react'
import Nametag from './Nametag'
import style from '../../../styles/Nametag/Nametags.css'
import {watchRoomNametags} from '../../actions/NametagActions'

class Nametags extends Component {

  componentDidMount() {
    this.props.dispatch(watchRoomNametags(this.props.room))
  }

  componentWillUnmount() {
    this.props.dispatch(unWatchRoomNatage(this.props.room))
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

      return <li key={nametag.id} className={style.nametag}>
        <Nametag
          name={nametag.name}
          bio={nametag.bio}
          icon={nametag.icon}
          id={nametag.id}
          certificates={nametag.certificates}
          mod={mod}/>
      </li>
    }

    return <ul className={style.nametags}>
        {
          nametags.map((nametag) => {
            return createNametag(nametag, this.props.mod)
          })
        }
      </ul>
  }
}

Nametags.propTypes = { room: PropTypes.string, mod: PropTypes.string }

export default Nametags
