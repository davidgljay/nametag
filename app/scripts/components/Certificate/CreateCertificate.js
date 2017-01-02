import React, {Component, PropTypes} from 'react'
import Certificate from './Certificate'
import TextField from 'material-ui/TextField'
import Navbar from '../Utils/Navbar'

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
    granter: 'Nametag',
  }

  updateCert = (property, value) => {
    if (property === 'name') {
      this.setState({[property]: value.slice(0, 20)})
    } else {
      this.setState({[property]: value})
    }
  }

  render() {
    const {name, icon, description, note, granter} = this.state
    const {user, logout, setting} = this.props
    return <div id='createCertificate'>
      <Navbar
        user={user}
        logout={logout}
        setting={setting}/>
      <Certificate
        certificate={{
          name,
          icon_array: icon,
          description_array: [description],
          notes: [
            {
              date: Date.now(),
              msg: note,
            },
          ],
          granter,
        }}
        draggable={false}
        expanded={true}
        />
      <TextField
        style={styles.textfield}
        value={this.state.name}
        onChange={(e) => this.updateCert('name', e.target.value)}
        floatingLabelText="Title"
        /><br/>
      {20 - this.state.name.length}<br/>
      <TextField
        style={styles.textfield}
        value={this.state.description}
        onChange={(e) => this.updateCert('description', e.target.value)}
        floatingLabelText="Description"
        /><br/>
      <TextField
        style={styles.textfield}
        value={this.state.note}
        onChange={(e) => this.updateCert('note', e.target.value)}
        floatingLabelText="Note"
        />
    </div>
  }
}

export default CreateCertificate

const styles = {
  textfield: {},
}
