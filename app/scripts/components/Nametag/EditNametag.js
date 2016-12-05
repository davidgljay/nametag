import React, { Component, PropTypes } from 'react'
import Alert from '../Utils/Alert'
import Certificate from '../Certificate/Certificate'
import { DropTarget } from 'react-dnd'
import { dragTypes } from '../../constants'
import {Card} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import IconMenu from 'material-ui/IconMenu'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem'
import AutoComplete from 'material-ui/AutoComplete'
import constants from '../../constants'

const styles = {
  editNametag: {
    width: 250,
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5,
  },
  cardInfo: {
    display: 'flex',
  },
  icon: {
    borderRadius: 25,
    width: 50,
    height: 50,
    margin: 5,
  },
  nameStyle: {
    width: 150,
    height: 40,
    marginLeft: 10,
  },
  nameTextfieldStyle: {
    width: 150,
    height: 40,
  },
  floatingLabelStyle: {
    top: 20,
  },
  menuItemStyle: {
    lineHeight: 'inherit',
  },
  menuItemInnerDivStyle: {
    padding: 6,
    textAlign: 'center',
  },
  uploadMenuItemInnerDivStyle: {
    padding: 6,
    display: 'flex',
    justifyContent: 'center',
  },
  uploadMenuItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    verticalAlign: 'middle',
    background: '#999',
  },
  uploadIcon: {
    color: '#FFF',
    marginTop: 13,
  },
}

const nametagTarget = {
  drop(props, monitor) {
    props.addUserNametagCert(monitor.getItem(), props.room)
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}

class EditNametag extends Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: null,
      alertType: null,
    }
    this.removeCert = this.removeCert.bind(this)
    this.updateNametagProperty = this.updateNametagProperty.bind(this)
  }

  componentDidMount() {
    const {userNametag, updateUserNametag, userDefaults, room} = this.props
    updateUserNametag(room, 'room', room)
    if (!userNametag.name
      && userDefaults.displayNames
      && userDefaults.displayNames.length >= 1) {
      updateUserNametag(room, 'name', userDefaults.displayNames[0])
    }
    if (!userNametag.icon
      && userDefaults.iconUrls
      && userDefaults.iconUrls.length >= 1) {
      updateUserNametag(room, 'icon', userDefaults.iconUrls[0])
    }
  }

  updateNametagProperty(property) {
    return (e) => {
      this.props.updateUserNametag(
        this.props.room,
        property,
        e.target.value
        )
    }
  }

  removeCert(cert) {
    this.props.removeUserNametagCert(cert, this.props.room)
  }

  render() {
    const {error, userDefaults, updateUserNametag, room, userNametag} = this.props

    const {
      menuStyle,
      menuItemStyle,
      menuItemInnerDivStyle,
      uploadIcon,
      uploadMenuItem,
      uploadMenuItemInnerDivStyle,
      nameStyle,
      nameTextfieldStyle,
      floatingLabelStyle,
    } = styles

    let nametag = userNametag || {
      name: '',
      bio: '',
      icon: '',
    }

    const uploadFontIcon = <FontIcon
        className="material-icons"
        style={uploadIcon}>
        add_to_photos
      </FontIcon>
    return this.props.connectDropTarget(<div>
          <Card style={styles.editNametag} className="profile">
            <div style={styles.cardInfo}>
              <IconMenu
              iconButtonElement= {
                nametag.icon ?
                  <img src={constants.USER_ICON_URL + nametag.icon} style={styles.icon}/>
                : <div style={uploadMenuItemInnerDivStyle}>
                    {uploadFontIcon}
                  </div>
              }
              anchorOrigin={{horizontal: 'left', vertical: 'top'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              style={styles.icon}
              menuStyle={menuStyle}>
              {
                  userDefaults.iconUrls.map((filename) =>
                    <MenuItem
                      key={filename}
                      style={menuItemStyle}
                      innerDivStyle={menuItemInnerDivStyle}
                      onTouchTap={() => updateUserNametag(room, 'icon', filename)}>
                      <img src={constants.USER_ICON_URL + filename} style={styles.icon}/>
                    </MenuItem>
                  )
              }
              <MenuItem
                style={menuItemStyle}
                innerDivStyle={uploadMenuItemInnerDivStyle}>
                  <div style={uploadMenuItem}>
                    {uploadFontIcon}
                  </div>
              </MenuItem>
            </IconMenu>
              <div style={{width: 190, flex: 1}}>
                  <AutoComplete
                    floatingLabelText="Name"
                    filter={AutoComplete.noFilter}
                    openOnFocus={true}
                    disableFocusRipple={false}
                    dataSource={userDefaults.displayNames}
                    errorText={error && error.nameError}
                    onUpdateInput={(name) => updateUserNametag(room, 'name', name)}
                    animated={true}
                    style={nameStyle}
                    textFieldStyle={nameTextfieldStyle}
                    fullWidth={false}
                    floatingLabelStyle={floatingLabelStyle}
                    underlineShow={false}
                    searchText={nametag.name}/>
                  <TextField
                    style={{width: 160}}
                    rows={2}
                    multiLine={true}
                    fullWidth={true}
                    errorText={error && error.bioError}
                    underlineShow={false}
                    onChange={this.updateNametagProperty('bio')}
                    value={nametag.bio}
                    hintText='What brings you to this conversation?'/>
              </div>
            </div>
            <div className="certificates">
              {nametag.certificates && nametag.certificates.map(
                (cert) =>
                  <Certificate
                    certificate={cert}
                    draggable={true}
                    removeFromSource={this.removeCert}
                    key={cert.id} />
                )}
            </div>
          </Card>
        </div>)
  }
}

EditNametag.propTyes = {
  dispatch: PropTypes.func.isRequired,
  userNametag: PropTypes.object,
  room: PropTypes.string.isRequired,
  isOver: PropTypes.bool.isRequired,
}

export default DropTarget(dragTypes.certificate, nametagTarget, collect)(EditNametag)
