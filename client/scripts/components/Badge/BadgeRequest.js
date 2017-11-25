import React, {Component, PropTypes} from 'react'
import {Card, CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Nametag from '../Nametag/Nametag'
import Badge from './Badge'
import t from '../../utils/i18n'
import FontIcon from 'material-ui/FontIcon'
import {primary, grey} from '../../../styles/colors'
import CircularProgress from 'material-ui/CircularProgress'
import TextField from 'material-ui/TextField'

class BadgeRequest extends Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      showNote: false,
      complete: false,
      note: 'Badge granted.'
    }

    this.deny = (e) => {
      e.preventDefault()
      const {updateBadgeRequestStatus, badgeRequest: {id}} = this.props
      updateBadgeRequestStatus(id, 'RESOLVED')
    }

    this.grant = (e) => {
      const {updateBadgeRequestStatus, createBadge, badgeRequest: {id, template, nametag}} = this.props
      this.setState({complete: true})
      createBadge({
        template: template.id,
        defaultNametag: nametag.id,
        note: this.state.note
      })
      .then(() => {
        return updateBadgeRequestStatus(id, 'RESOLVED')
      })
    }

    this.approve = () => {
      this.setState({showNote: true})
    }

    this.updateNote = (e, note) => {
      e.preventDefault()
      this.setState({note})
    }
  }

  render () {
    const {badgeRequest: {nametag, template}} = this.props
    const {loading, showNote, note, complete} = this.state
    if (loading) {
      return <Card style={{...styles.card, ...styles.emptyCard}}>
        <CircularProgress />
      </Card>
    }

    if (complete) {
      return <Card style={{...styles.card, ...styles.emptyCard}}>
        <FontIcon style={styles.complete}
          className='material-icons'
          alt='complete' >
          check
        </FontIcon>
      </Card>
    }
    return <Card style={styles.card}>
      <div>
        <Nametag nametag={nametag} />
        {
          showNote
          ? <div style={styles.addNote}>
            <TextField
              multiLine
              fullWidth
              onChange={this.updateNote}
              value={note}
              floatingLabelText={t('badge.note')} />
            <div style={styles.noteText}>
              {t('badge.note_grant', nametag.name)}
            </div>
            <div style={styles.grantButtons}>
              <FontIcon style={styles.backLink}
                className='material-icons'
                alt='back'
                onClick={() => this.setState({showNote: false})} >
                chevron_left
              </FontIcon>
              <RaisedButton
                primary
                label={t('badge.grant_badge')}
                onClick={this.grant} />
            </div>
          </div>
          : <div>
            <div style={styles.cardText}>{t('badge.would_like')}</div>
            <div style={styles.badgeContainer}>
              <Badge badge={{
                id: 'request',
                notes: [],
                template
              }} />
            </div>
            <CardActions>
              <FlatButton label={t('badge.deny')} secondary onClick={this.deny} />
              <FlatButton label={t('approve')} primary onClick={this.approve} />
            </CardActions>
          </div>
        }
      </div>
    </Card>
  }
}

BadgeRequest.propTypes = {
  createBadge: PropTypes.func.isRequired,
  updateBadgeRequestStatus: PropTypes.func.isRequired,
  badgeRequest: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    template: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      description: PropTypes.string
    }).isRequired,
    nametag: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      bio: PropTypes.string,
      image: PropTypes.string,
      badges: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
    })
  }).isRequired
}

export default BadgeRequest

const styles = {
  badgeContainer: {
    marginLeft: 10,
    display: 'flex',
    flexWrap: 'wrap'
  },
  headerText: {
    color: primary,
    fontWeight: 'bold'
  },
  cardText: {
    margin: 10
  },
  card: {
    margin: 5,
    padding: 7,
    maxWidth: 230,
    backgroundColor: '#E9F2F1'
  },
  emptyCard: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 230,
    height: 230
  },
  noteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: grey
  },
  addNote: {
    margin: 10
  },
  backLink: {
    color: grey,
    padding: 10,
    margin: 5,
    cursor: 'pointer'
  },
  complete: {
    color: primary,
    fontSize: 44
  },
  grantButtons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  }
}
