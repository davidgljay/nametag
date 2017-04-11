import React, {Component, PropTypes} from 'react'
import {Card} from 'material-ui/Card'
import {dateFormat} from '../Utils/DateFormat'
import Nametag from '../Nametag/Nametag'

class DefaultNametag extends Component {

  render () {
    const {defaultNametag, notes} = this.props
    return <Card style={styles.nametag}>
      <Nametag
        nametag={{...defaultNametag, present: true}} />
      <div>
        {
          notes.map(note => <div key={note.date} style={styles.noteText}>
            {`${dateFormat(note.date)}: ${note.text}`}
          </div>)
        }
      </div>
    </Card>
  }
}

const {string, shape, object, arrayOf} = PropTypes
DefaultNametag.propTypes = {
  id: string.isRequired,
  defaultNametag: object.isRequired,
  notes: arrayOf(shape({
    text: string.isRequired,
    date: string.isRequired
  }))
}

export default DefaultNametag

const styles = {
  nametag: {
    width: 250,
    margin: 7,
    padding: 5
  },
  noteText: {
    fontSize: 14,
    margin: 5
  }
}
