import React, {Component, PropTypes} from 'react'
import Badge from './Badge'
import TextField from 'material-ui/TextField'
import Navbar from '../Utils/Navbar'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500} from 'material-ui/styles/colors'

class CreateBadge extends Component {

  constructor (props) {
    super(props)

    this.state = {
      name: '',
      icon: null,
      description: '',
      note: 'Badge granted.',
      uploading: false,
      badgeFor: 'me'
    }

    this.updateBadge = (property, value) => {
      if (property === 'name') {
        this.setState({[property]: value.slice(0, 40)})
      } else {
        this.setState({[property]: value})
      }
    }

    this.onChooseImage = () => {
      this.setState({uploading: true})
    }

    this.onUploadImage = ({url}) => {
      this.updateBadge('icon', [url])
      this.setState({uploading: false})
    }

    this.onBadgeForChange = (val) => {
      this.setState({badgeFor: val})
    }

    this.createSelfBadge = () => {
      const {appendUserArray, toggleCreateBadge} = this.props
      this.badgePromise(true)
        .then(badge => {
          if (!badge.id) {
            console.log('Error creating badge', badge)
            return
          }
          return appendUserArray('badges', badge.id)
        })
        .then(() => {
          toggleCreateBadge()
        })
    }

    this.badgePromise = (markGranted) => {
      const {user, createBadge, mini} = this.props
      const {name, icon, description, note} = this.state
      const granter = mini ? 'Self' : this.props.user.data.displayNames[0]
      return createBadge(
        user.id,
        [description],
        granter,
        icon && [icon],
        name,
        [{
          date: Date.now(),
          msg: note
        }],
        markGranted)
    }

    this.createBadge = () => {
      this.badgePromise(false)
        .then(badge => {
          window.location = `/badges/${badge.id}`
        })
    }
  }

  render () {
    const {name, icon, description, note} = this.state
    const {user, logout, setting, mini} = this.props

    if (!user.id) {
      return <CircularProgress />
    }

    return <div id='createBadge'>
      {
        !mini &&
        <Navbar
          user={user}
          logout={logout}
          setting={setting} />
      }
      <div style={styles.container}>
        {
          !mini &&
          <div>
            <h2>Create a Badge</h2>
            <div style={styles.description}>
              Badges can be used to verify things about someone, such as their
              membership in a group. You can also create badges for yourself
              to express your identity.
            </div>
          </div>
        }
        <div style={styles.badgePreview}>
          <Badge
            badge={{
              name,
              icon_array: icon,
              description_array: [description],
              notes: [{
                date: Date.now(),
                msg: note
              }],
              granter: mini ? 'Self' : this.props.user.data.displayNames[0]
            }}
            draggable={false}
            expanded
            showIconUpload
            onUploadImage={this.onUploadImage} />
        </div>
        <TextField
          style={styles.textfield}
          value={this.state.name}
          onChange={(e) => this.updateBadge('name', e.target.value)}
          floatingLabelText='Title'
          />
        <div style={styles.counter}>{40 - this.state.name.length}</div><br />
        <div style={styles.description}>
          An identity that can be shared with others, such as "Lawyer" or "Dog Lover".
        </div>
        <TextField
          style={styles.textfield}
          value={this.state.description}
          onChange={(e) => this.updateBadge('description', e.target.value)}
          floatingLabelText='Description'
          />
        <div style={styles.description}>
          A more detailed explanation, such as
          "Member in good standing of the House of Hufflepuff."
          Should not include personally identifiable information.
        </div>
        {
          !mini &&
          <div>
            <TextField
              style={styles.textfield}
              value={this.state.note}
              onChange={(e) => this.updateBadge('note', e.target.value)}
              floatingLabelText='Note'
              />
            <div style={styles.description}>
              An optional note about why this badge was granted.
            </div>
          </div>
        }
        <div style={styles.createButton}>
          <RaisedButton
            labelStyle={styles.buttonLabel}
            backgroundColor={indigo500}
            label={'CREATE BADGE'}
            onClick={mini ? this.createSelfBadge : this.createBadge} />
        </div>
      </div>
    </div>
  }
}

CreateBadge.propTypes = {
  user: PropTypes.object.isRequired,
  createBadge: PropTypes.func.isRequired,
  appendUserArray: PropTypes.func.isRequired
}

export default CreateBadge

const styles = {
  badgePreview: {
    lineHeight: '20px',
    width: 250
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  counter: {
    marginLeft: 280,
    fontSize: 12,
    color: '#008000'
  },
  description: {
    maxWidth: 290,
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic'
  },
  textfield: {
    width: 290
  },
  createButton: {
    margin: 30
  },
  buttonLabel: {
    color: '#fff'
  }
}
