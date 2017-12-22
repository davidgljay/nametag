import component from '../../components/Utils/ImageUpload'
import {connect} from 'react-redux'
import {compose} from 'react-apollo'
import {uploadImage} from '../../actions/RoomActions'

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    uploadImage: disp(uploadImage)
  }
}

const ImageUpload = compose(connect(mapStateToProps, mapDispatchToProps))(component)

export default ImageUpload
