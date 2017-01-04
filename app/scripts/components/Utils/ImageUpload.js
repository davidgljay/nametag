import React, {Component, PropTypes} from 'react'
import FontIcon from 'material-ui/FontIcon'
import FileUpload from 'react-fileupload'
import errorLog from '../../utils/errorLog'

class ImageUpload extends Component {

  static propTypes = {
    onChooseFile: PropTypes.func.isRequired,
    onUploadFile: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
  }

  render() {
    const {width, onChooseFile, onUploadFile} = this.props

    const uploadOptions = {
      baseUrl: `https://${document.location.host}/api/images?width=${width}`,
      chooseAndUpload: true,
      accept: '.jpg,.jpeg,.png',
      dataType: 'json',
      chooseFile: onChooseFile,
      uploadSuccess: onUploadFile,
      uploadError: errorLog('Uploading Image'),
    }

    return <FileUpload
        options={uploadOptions}>
        <div style={styles.uploadMenuItem} ref="chooseAndUpload">
          <FontIcon
              className="material-icons"
              style={styles.uploadIcon}>
              add_to_photos
            </FontIcon>
        </div>
      </FileUpload>
  }
}

export default ImageUpload

const styles =
  {
    uploadIcon: {
      color: '#FFF',
      marginTop: 13,
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
      background: '#999',
    },
  }
