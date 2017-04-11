import React, {Component, PropTypes} from 'react'
import FileUpload from 'react-fileupload'
import TextField from 'material-ui/TextField'
import {Card} from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import {indigo500, grey500} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import errorLog from '../../../utils/errorLog'

class ImageSearch extends Component {

  constructor (props) {
    super(props)

    this.state = {
      images: [],
      loading: false,
      loadingImage: false
    }

    this.handleScroll = () => {
      const bottom = document.getElementById('scrollBottom')
      if (bottom && !this.state.loading &&
        this.state.images.length < this.state.totalResults &&
        this.scrolledToBottom(bottom)) {
        this.loadMore(Math.round(this.state.images.length / 50) + 1)
      }
    }

    this.scrolledToBottom = (bottom) => {
      return bottom.getBoundingClientRect().top < window.innerHeight
    }

    this.loadMore = (start) => {
      this.setState({loading: true})
      this.props.searchImage(this.state.imageQuery, start)
        .then(this.prepImages)
    }

    this.prepImages = (searchResults) => {
      this.setState((prevState) => {
        prevState.searched = true
        prevState.loading = false
        prevState.totalResults = parseInt(searchResults.total, 10)
        if (prevState.totalResults === 0) {
          return prevState
        }
        prevState.images = prevState.images.concat(searchResults.photos.map((item) => {
          return {
            thumbnail: item.thumbnail,
            link: item.link
          }
        }))
        return prevState
      })
    }

    this.onSearchClick = () => {
      this.props.searchImage(this.state.imageQuery)
        .then(this.prepImages)
      this.setState({loading: true})
      this.setState({images: []})
    }

    this.setImageQuery = (e) => {
      this.setState({imageQuery: e.target.value})
    }

    this.onImageClick = (url) => () => {
      this.setState({loadingImage: true})
      this.props.setImageFromUrl(300, null, url)
        .then((res) => {
          this.props.updateRoom('image', res.url)
          this.setState({loadingImage: false})
        })
    }

    this.onUpload = (res) => {
      this.props.updateRoom('image', res.url)
      this.setState({loadingImage: false})
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    const uploadOptions = {
      baseUrl: 'https://' + document.location.host + '/api/images?width=300',
      chooseAndUpload: true,
      accept: 'image/*',
      dataType: 'json',
      uploadSuccess: this.onUpload,
      uploadError: errorLog('Uploading Room Image')
    }

    return <div style={styles.container}>
      <div style={styles.searchContainer}>
        <TextField
          onChange={this.setImageQuery}
          floatingLabelText='Search Flickr...'
          errorText={this.props.error}
          value={this.state.imageQuery}
          style={styles.searchField} />
        <RaisedButton
          backgroundColor={indigo500}
          style={styles.button}
          labelStyle={styles.labelStyle}
          label='FIND IMAGE'
          onClick={this.onSearchClick} />
      </div>
      {
        this.state.loadingImage
        ? <CircularProgress />
        : <div style={styles.imagesContainer}>
          <Card
            style={{...styles.thumbnailContainer, ...styles.imageUpload}}>
            <FileUpload
              onClick={() => this.setState({loadingImage: true})}
              options={uploadOptions}>
              <IconButton
                style={styles.imageUploadButton}
                imageStyle={styles.imageUploadIcon}
                imageClassName='material-icons'
                ref='chooseAndUpload'>
                  cloud_upload
                </IconButton>
            </FileUpload>
          </Card>
          {
            this.state.images.map((image, i) => {
              return <Card
                style={styles.thumbnailContainer}
                key={i}
                onClick={this.onImageClick(image.link)}>
                <img src={image.thumbnail} style={styles.thumbnail} />
              </Card>
            })
          }
          {
            this.state.loading &&
            <div style={styles.spinnerDiv}>
              <CircularProgress />
            </div>
          }
          {
            this.state.searched &&
            this.state.images.length === 0 &&
            <div style={styles.noResults}>No results found, please try again.</div>
          }
          <div id='scrollBottom' />
        </div>
      }
    </div>
  }
}

ImageSearch.propTypes = {
  searchImage: PropTypes.func.isRequired
}

export default ImageSearch

const styles = {
  button: {
    margin: 20
  },
  labelStyle: {
    padding: '0px 10px',
    color: '#fff'
  },
  container: {
    marginTop: 10,
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  searchIcon: {
    verticalAlign: 'middle'
  },
  searchContainer: {
    width: '100%',
    display: 'flex',
    marginBottom: 10
  },
  searchField: {
    borderRadius: 3,
    marginLeft: 10,
    flex: 1
  },
  spinnerDiv: {
    margin: 20,
    textAlign: 'center'
  },
  thumbnail: {
    width: 150,
    height: 100,
    objectFit: 'cover'
  },
  thumbnailContainer: {
    margin: '10px 3px',
    width: 150,
    height: 100,
    minHeight: 100,
    cursor: 'pointer'
  },
  imagesContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    margin: 5,
    overflow: 'auto',
    height: 300
  },
  noResults: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingBottom: 10
  },
  imageUpload: {
    backgroundColor: grey500
  },
  imageUploadButton: {
    width: 90,
    height: 100
  },
  imageUploadIcon: {
    fontSize: 65,
    color: '#fff'
  }
}
