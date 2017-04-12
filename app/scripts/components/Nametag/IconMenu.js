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
      this.props.updateNametagEdit(this.props.about, 'image', res.url)
      this.setState({loadingImage: false})
    }

    this.onUpdateIcon = (url) => () => {
      this.setState({showMenu: false})
      this.props.updateNametagEdit(this.props.about, 'image', url)
    }
  }

  render () {
    const {image, images = []} = this.props
    const {loadingImage, showMenu} = this.state

    const uploadIcon = <ImageUpload
      onChooseFile={() => this.setState({showMenu: false, loadingImage: true})}
      onUploadFile={this.onUpload}
      width={50} />

    let render
    if (loadingImage) {
      render = <CircularProgress />
    } else if (!image) {
      render = uploadIcon
    } else {
      render = <IconMenu
        iconButtonElement={
          <IconButton style={styles.buttonStyle} imageStyle={styles.image}>
            <img src={image} />
          </IconButton>
        }
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        style={styles.menuStyle}
        open={showMenu}
        onTouchTap={() => { this.setState({showMenu: true}) }}
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
          innerDivStyle={styles.menuItemInnerDivStyle}>
          {uploadIcon}
        </MenuItem>
      </IconMenu>
    }
    return render
  }
}

NTIconMenu.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
  updateNametagEdit: PropTypes.func.isRequired,
  about: PropTypes.string.isRequired
}

export default NTIconMenu

const styles = {
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
