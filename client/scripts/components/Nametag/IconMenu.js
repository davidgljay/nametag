import React, {Component, PropTypes} from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import ImageUpload from '../../containers/Utils/ImageUploadContainer'

class NTIconMenu extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loadingImage: false,
      showMenu: false,
      uploadingFile: false
    }

    this.onChooseFile = file => {
      this.setState({loadingImage: true})
    }

    this.onUpload = (res) => {
      const {updateNametagEdit, updateNametag, toggleNametagImageMenu, about} = this.props
      if (updateNametag) {
        updateNametag(about, {image: res.url})
        toggleNametagImageMenu(false)
      } else if (updateNametagEdit) {
        updateNametagEdit(about, 'image', res.url)
      }
      this.setState({loadingImage: false, uploadingFile: false})
    }

    this.onUpdateIcon = (url) => () => {
      const {updateNametagEdit, updateNametag, toggleNametagImageMenu, about} = this.props
      this.setState({showMenu: false})
      if (updateNametag) {
        updateNametag(about, {image: url})
        toggleNametagImageMenu(false)
      } else if (updateNametagEdit) {
        updateNametagEdit(about, 'image', url)
      }
    }
  }

  componentDidMount () {
    const {showMenu} = this.props
    if (showMenu) {
      this.setState({showMenu})
    }
  }

  render () {
    const {image, images = []} = this.props
    const {loadingImage, showMenu, uploadingFile} = this.state

    const uploadIcon = <ImageUpload
      onChooseFile={this.onChooseFile}
      onUploadFile={this.onUpload}
      width={80} />
    let render
    if (loadingImage) {
      render = <div style={styles.loading}><CircularProgress /></div>
    } else if (!image) {
      render = uploadIcon
    } else {
      render = <IconMenu
        iconButtonElement={
          <IconButton style={styles.buttonStyle} iconStyle={styles.image}>
            <img src={image} />
          </IconButton>
        }
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        style={styles.menuStyle}
        open={showMenu}
        // Need to keep menu open while selecting a file for upload
        onRequestChange={open => uploadingFile ? null : this.setState({showMenu: open})}
        onClick={() => this.setState({showMenu: true})}
        menuStyle={styles.menuStyle}>
        {
          images.map((url) =>
            <MenuItem
              key={url}
              style={styles.menuItemStyle}
              innerDivStyle={styles.menuItemInnerDivStyle}
              onTouchTap={this.onUpdateIcon(url)}>
              <img src={url} style={styles.image} />
            </MenuItem>
          )
      }
        <MenuItem
          style={styles.menuItemStyle}
          onClick={() => this.setState({uploadingFile: true, showMenu: true})}
          innerDivStyle={styles.menuItemInnerDivStyle}>
          {uploadIcon}
        </MenuItem>
      </IconMenu>
    }
    return render
  }
}

const {arrayOf, string, func, bool} = PropTypes

NTIconMenu.propTypes = {
  images: arrayOf(string),
  image: string,
  showMenu: bool,
  updateNametagEdit: func,
  toggleNametagImageMenu: func,
  updateNametag: func,
  about: string.isRequired
}

export default NTIconMenu

const styles = {
  loading: {
    padding: 20,
    borderRadius: 20
  },
  menuItemStyle: {
    lineHeight: 'inherit',
    minHeight: 80
  },
  menuItemInnerDivStyle: {
    padding: 6,
    textAlign: 'center'
  },
  image: {
    borderRadius: 25,
    width: 50,
    height: 50
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
