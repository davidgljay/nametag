import React, {Component, PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'
import {primary} from '../../../styles/colors'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import {injectStripe} from 'react-stripe-elements'
import t from '../../utils/i18n'

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

      contactForm(name, email, organization, note)
    }
  }

  render () {
    // const {name, email, organization, note} = this.state
    const {closeDialog, open, title} = this.props

    return <div>
      <Dialog
        modal={false}
        contentStyle={styles.dialog}
        bodyStyle={styles.bodyStyle}
        open={open}
        onRequestClose={closeDialog}>
        <FontIcon
          onClick={closeDialog}
          style={styles.closeIcon}
          className='material-icons'>
          close
        </FontIcon>
        <h3>{title}</h3>
        <form onSubmit={this.onSubmit}>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            style={styles.input}
            onChange={this.setItem('name')}
            />
          <label htmlFor='email'>E-mail</label>
          <input
            id='email'
            type='text'
            style={styles.input}
            onChange={this.setItem('email')} />
          <label htmlFor='organization'>Organization</label>
          <input
            id='organization'
            type='text'
            style={styles.input}
            onChange={this.setItem('organization')} />
          <label htmlFor='note'>Organization</label>
          <textarea
            id='note'
            rowtype='text'
            rows={3}
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

const {func} = PropTypes

ContactDialog.propTypes = {
  closeDialog: func.isRequired,
  contactForm: func.isRequired
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
