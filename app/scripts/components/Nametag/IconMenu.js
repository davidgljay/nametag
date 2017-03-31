import React, {Component, PropTypes} from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import ImageUpload from '../Utils/ImageUpload'

class NTIconMenu extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loadingImage: false,
      showMenu: false
    }

    this.onUpload = (res) => {
      this.props.updateNametagEdit(this.props.about, 'icon', res.url)
      this.setState({loadingImage: false})
    }

    this.onUpdateIcon = (url) => () => {
      this.setState({showMenu: false})
      this.props.updateNametagEdit(this.props.about, 'icon', url)
    }
  }

  render () {
    const {icon, icons} = this.props
    const {loadingImage, showMenu} = this.state

    const uploadIcon = <ImageUpload
      onChooseFile={() => this.setState({showMenu: false, loadingImage: true})}
      onUploadFile={this.onUpload}
      width={50} />

    let render
    if (loadingImage) {
      render = <CircularProgress />
    } else if (!icon) {
      render = uploadIcon
    } else {
      render = <IconMenu
        iconButtonElement={
          <IconButton style={styles.buttonStyle} iconStyle={styles.icon}>
            <img src={icon} />
          </IconButton>
        }
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        style={styles.icon}
        open={showMenu}
        onTouchTap={() => { this.setState({showMenu: true}) }}
        menuStyle={styles.menuStyle}>
        {
          icons.map((url) =>
            <MenuItem
              key={url}
              style={styles.menuItemStyle}
              innerDivStyle={styles.menuItemInnerDivStyle}
              onTouchTap={this.onUpdateIcon(url)}>
              <img src={url} style={styles.icon} />
            </MenuItem>
          )
      }
        <MenuItem
          style={styles.menuItemStyle}
          innerDivStyle={styles.menuItemInnerDivStyle}>
          {uploadIcon}
        </MenuItem>
      </IconMenu>
    }
    return render
  }
}

NTIconMenu.propTypes = {
  icons: PropTypes.arrayOf(PropTypes.string).isRequired,
  icon: PropTypes.string,
  updateNametagEdit: PropTypes.func.isRequired,
  about: PropTypes.string.isRequired
}

export default NTIconMenu

const styles = {
  menuItemStyle: {
    lineHeight: 'inherit'
  },
  menuItemInnerDivStyle: {
    padding: 6,
    textAlign: 'center'
  },
  icon: {
    borderRadius: 25
  },
  menuStyle: {
    padding: 0
  },
  buttonStyle: {
    padding: 4,
    width: 'initial',
    height: 'initial'
  }
}
