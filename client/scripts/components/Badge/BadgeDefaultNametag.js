import React, {Component, PropTypes} from 'react'
import {Card, CardActions} from 'material-ui/Card'
import t, {timeago} from '../../utils/i18n'
import Nametag from '../Nametag/Nametag'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {grey} from '../../../styles/colors'

class DefaultNametag extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showAddNote: false,
      note: ''
    }

    this.updateNote = (e, note) => {
      e.preventDefault()
      this.setState({note})
    }

    this.addNote = (e) => {
      e.preventDefault()
      this.props.addNote(this.props.id, this.state.note)
        .then(() => {
          this.setState({note: '', showAddNote: false})
        })
    }
  }

  render () {
    const {defaultNametag, notes} = this.props
    const {showAddNote, note} = this.state
    return <Card style={styles.nametag}>
      <div
        style={styles.clickable}
        onClick={() => this.setState({showAddNote: !showAddNote})}>
        <Nametag
          nametag={{...defaultNametag, present: true}}
          onClick={() => this.setState({showAddNote: true})} />
      </div>
      <div>
        {
          notes.map(note => <div key={note.date} style={styles.noteText}>
            {`${timeago(note.date)}: ${note.text}`}
          </div>)
        }
      </div>
      {
        showAddNote &&
        <div>
          <TextField
            multiLine
            fullWidth
            onChange={this.updateNote}
            value={note}
            floatingLabelText={t('badge.note')} />
          <div style={styles.noteHint}>
            {t('badge.note_hint')}
          </div>
          <CardActions
            style={styles.actions}>
            <RaisedButton
              label={t('badge.add_note')}
              primary
              onClick={this.addNote} />
          </CardActions>
        </div>
      }
    </Card>
  }
}

const {string, shape, object, arrayOf, func} = PropTypes
DefaultNametag.propTypes = {
  id: string.isRequired,
  defaultNametag: object.isRequired,
  notes: arrayOf(shape({
    text: string.isRequired,
    date: string.isRequired
  })),
  addNote: func.isRequired
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
  },
  noteHint: {
    fontSize: 14,
    fontStyle: 'italic',
    color: grey
  },
  clickable: {
    cursor: 'pointer'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}
