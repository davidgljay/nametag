import React, {Component, PropTypes} from 'react'
import FileUpload from 'react-fileupload'
import IconMenu from 'material-ui/IconMenu'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem'
import onClickOutside from 'react-onclickoutside'
import CircularProgress from 'material-ui/CircularProgress'
import errorLog from '../../utils/errorLog'
import ImageUpload from '../Utils/ImageUpload'

class NTIconMenu extends Component {

  static propTypes = {
    iconUrls: PropTypes.array.isRequired,
    icon: PropTypes.string,
    updateUserNametag: PropTypes.func.isRequired,
    appendUserArray: PropTypes.func.isRequired,
  }

  state = {
    loadingImage: false,
    showMenu: false,
  }

  onUpload = (res) => {
    this.props.updateUserNametag(this.props.room, 'icon', res.url)
    this.props.appendUserArray('iconUrls', res.url)
    this.setState({loadingImage: false})
  }

  handleClickOutside() {
    this.setState({showMenu: false})
  }

  onUpdateIcon = (url) => () => {
    this.setState({showMenu: false})
    this.props.updateUserNametag(this.props.room, 'icon', url)
  }

  render() {
    const {icon, iconUrls} = this.props
    const {loadingImage, showMenu} = this.state

    const uploadIcon = <ImageUpload
      onChooseFile = {()=>this.setState({showMenu: false, loadingImage: true})}
      onUploadFile = {this.onUpload}
      width={50}/>

    let render
    if (loadingImage) {
      render = <CircularProgress />
    } else if (!icon) {
      render = uploadIcon
    } else {
      render = <IconMenu
      iconButtonElement= {<img src={icon} style={styles.icon}/>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      style={styles.icon}
      open={showMenu}
      onTouchTap={()=>{
        this.setState({showMenu: !showMenu})
      }}
      menuStyle={styles.menuStyle}>
      {
          iconUrls.map((url) =>
            <MenuItem
              key={url}
              style={styles.menuItemStyle}
              innerDivStyle={menuItemInnerDivStyle}
              onTouchTap={this.onUpdateIcon(url)}>
              <img src={url} style={styles.icon}/>
            </MenuItem>
          )
      }
        {uploadIcon}
      </IconMenu>
    }
    return render
  }
}

export default onClickOutside(NTIconMenu)

const styles = {
  menuItemStyle: {
    lineHeight: 'inherit',
  },
  menuItemInnerDivStyle: {
    padding: 6,
    textAlign: 'center',
  },
  uploadMenuItem: {
    display: 'flex',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    cursor: 'pointer',
    textAlign: 'center',
    verticalAlign: 'middle',
    background: '#999',
  },
  uploadIcon: {
    color: '#FFF',
    marginTop: 13,
  },
}
