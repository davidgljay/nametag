import React from 'react'
import FontIcon from 'material-ui/FontIcon'
import FileUpload from 'react-fileupload'
import errorLog from '../../utils/errorLog'

const ImageUpload = ({width, onChooseFile, onUploadFile}) => {
  const uploadOptions = {
    baseUrl: `https://${document.location.host}/api/images?width=${width}`,
    chooseAndUpload: true,
    accept: 'image/*',
    dataType: 'json',
    chooseFile: onChooseFile,
    uploadSuccess: onUploadFile,
    uploadError: errorLog('Uploading Image')
  }

  return <FileUpload
    options={uploadOptions}>
    <div style={styles.uploadMenuItem} ref='chooseAndUpload'>
      <FontIcon
        className='material-icons'
        style={styles.uploadIcon}>
        photo
        </FontIcon>
    </div>
  </FileUpload>
}

export default ImageUpload

const styles =
  {
    uploadIcon: {
      color: '#FFF',
      marginTop: 13
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
