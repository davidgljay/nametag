import React, {Component, PropTypes} from 'react'
import Certificate from './Certificate'
import TextField from 'material-ui/TextField'
import Navbar from '../Utils/Navbar'
import ImageUpload from '../Utils/ImageUpload'
import trackEvent from '../../utils/analytics'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500} from 'material-ui/styles/colors'
class CreateCertificate extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    createCertificate: PropTypes.func.isRequired,
  }

  state = {
    name: '',
    icon: null,
    description: '',
    note: 'Certificate granted.',
    uploading: false,
    certFor: 'me',
  }

  updateCert = (property, value) => {
    if (property === 'name') {
      this.setState({[property]: value.slice(0, 25)})
    } else {
      this.setState({[property]: value})
    }
  }

  onChooseImage = () => {
    trackEvent('CHOOSE_CERT_IMAGE')
    this.setState({uploading: true})
  }

  onUploadImage = ({url}) => {
    this.updateCert('icon', [url])
    this.setState({uploading: false})
  }

  onCertForChange = (val) => {
    this.setState({certFor: val})
  }

  createCert = () => {
    const {user, createCertificate} = this.props
    const {name, icon, description, note} = this.state
    createCertificate(
      user.id,
      [description],
      user.data.displayNames[0],
      [icon],
      name,
      [{
        date: Date.now(),
        msg: note,
      }],
      false)
      .then((cert) => {
        window.location = `/certificates/${cert.id}`
      })
  }

  render() {
    const {name, icon, description, note} = this.state
    const {user, logout, setting} = this.props

    if (!user.id) {
      return <CircularProgress/>
    }

    return <div id='createCertificate'>
      <Navbar
        user={user}
        logout={logout}
        setting={setting}/>
      <div style={styles.container}>
        <h2>Create a Certificate</h2>
        <div style={styles.description}>
          Certificates can be used to verify things about someone, such as their
          membership in a group. You can also create certificates for yourself
          to express your identity.
        </div>
        <div style={styles.certPreview}>
          <Certificate
            certificate={{
              name,
              icon_array: icon,
              description_array: [description],
              notes: [{
                date: Date.now(),
                msg: note,
              }],
              granter: user.data.displayNames[0],
            }}
            draggable={false}
            expanded={true}
            />
        </div>
        <TextField
          style={styles.textfield}
          value={this.state.name}
          onChange={(e) => this.updateCert('name', e.target.value)}
          floatingLabelText="Title"
          />
        <div style={styles.counter}>{25 - this.state.name.length}</div><br/>
        <div style={styles.description}>
          An identity that can be shared with others, such as "Lawyer" or "Dog Lover".
        </div>
        {
          this.state.uploading ?
          <CircularProgress/>
          : <ImageUpload
              width={50}
              onChooseFile={this.onChooseImage}
              onUploadFile={this.onUploadImage}/>
        }
        <div style={styles.description}>
          Optional: Upload an icon for your certificate.
        </div>
        <TextField
          style={styles.textfield}
          value={this.state.description}
          onChange={(e) => this.updateCert('description', e.target.value)}
          floatingLabelText="Description"
          />
        <div style={styles.description}>
          A more detailed explanation, such as
          "Member in good standing of the House of Hufflepuff."
          Should not include personally identifiable information.
        </div>
        <TextField
          style={styles.textfield}
          value={this.state.note}
          onChange={(e) => this.updateCert('note', e.target.value)}
          floatingLabelText="Note"
          />
        <div style={styles.description}>
          An optional note about why this certificate was granted.
        </div>
        <div style={styles.createButton}>
          <RaisedButton
            labelStyle={styles.buttonLabel}
            backgroundColor={indigo500}
            label={'CREATE CERTIFICATE'}
            onClick={this.createCert}/>
        </div>
      </div>
    </div>
  }
}

export default CreateCertificate

const styles = {
  certPreview: {
    fontSize: 16,
    lineHeight: '20px',
    width: 250,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  counter: {
    marginLeft: 300,
    fontSize: 12,
    color: '#008000',
  },
  description: {
    maxWidth: 310,
    color: '#999',
    marginBottom: 20,
  },
  textfield: {
    width: 310,
  },
  createButton: {
    margin: 30,
  },
  buttonLabel: {
    color: '#fff',
  },
}
