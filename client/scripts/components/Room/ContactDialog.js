import React, {Component, PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'
// import {primary} from '../../../styles/colors'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import {injectStripe} from 'react-stripe-elements'
// import t from '../../utils/i18n'
import TextField from 'material-ui/TextField'
import {track} from '../../utils/analytics'

class ContactDialog extends Component {

  constructor (props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      organization: '',
      note: ''
    }

    this.setItem = item => e => {
      e.preventDetfault
      this.setState({[item]: e.target.value})
    }

    this.onSubmit = (e) => {
      e.preventDefault()
      const {name, email, organization, note} = this.state
      const {contactForm} = this.props

      track('CONTACT_SUBMIT')

      contactForm(name, email, organization, note)
    }
  }

  render () {
    // const {name, email, organization, note} = this.state
    const {closeDialog, reason} = this.props

    const title = reason === 'requestDemo' ? 'Request Demo' : 'Contact Us'

    return <div>
      <Dialog
        modal={false}
        contentStyle={styles.dialog}
        bodyStyle={styles.bodyStyle}
        open={!!reason}
        onRequestClose={closeDialog}>
        <FontIcon
          onClick={closeDialog}
          style={styles.closeIcon}
          className='material-icons'>
          close
        </FontIcon>
        <h3>{title}</h3>
        <form onSubmit={this.onSubmit}>
          <TextField
            id='name'
            type='text'
            floatingLabel='Name'
            style={styles.input}
            onChange={this.setItem('name')}
            />
          <TextField
            id='email'
            type='text'
            floatingLabel='E-mail'
            style={styles.input}
            onChange={this.setItem('email')} />
          <TextField
            id='organization'
            type='text'
            floatingLabel='Organization'
            style={styles.input}
            onChange={this.setItem('organization')} />
          <label htmlFor='note'>Organization</label>
          <TextField
            id='note'
            rowtype='text'
            rows={3}
            floatingLabel={'Anything else you\'d like to add?'}
            style={styles.input}
            onChange={this.setItem('note')} />
          <div style={styles.buttonContainer}>
            <RaisedButton
              onClick={this.onSubmit}
              label={title}
              primary />
          </div>
        </form>
      </Dialog>
    </div>
  }
}

const {func, string} = PropTypes

ContactDialog.propTypes = {
  closeDialog: func.isRequired,
  contactForm: func.isRequired,
  reason: string.isRequired
}

export default injectStripe(ContactDialog)

const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20
  },
  closeIcon: {
    float: 'right',
    cursor: 'pointer'
  }
}
