import React, {Component, PropTypes} from 'react'
import FontIcon from 'material-ui/FontIcon'

class ImageUpload extends Component {

  render () {
    const {width, onChooseFile, onUploadFile, uploadImage} = this.props

    const onChange = (e) => {
      e.preventDefault()
      onChooseFile()
      return uploadImage(width, e.target.files[0])
        .then(onUploadFile)
    }

    return <div style={styles.uploadMenuItem}>
      <label>
        <input type='file' onChange={onChange} style={styles.uploadInput} />
        <FontIcon
          className='material-icons'
          style={styles.uploadIcon}>
          add_a_photo
        </FontIcon>
      </label>
    </div>
  }
}

ImageUpload.propTypes = {
  width: PropTypes.number.isRequired,
  onChooseFile: PropTypes.func.isRequired,
  onUploadFile: PropTypes.func.isRequired
}

export default ImageUpload

const styles =
  {
    uploadIcon: {
      color: '#FFF',
      marginTop: 13
    },
    uploadInput: {
      display: 'none'
    },
    uploadMenuItem: {
      display: 'flex',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
      margin: 10,
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'middle',
      background: '#999'
    }
  }
