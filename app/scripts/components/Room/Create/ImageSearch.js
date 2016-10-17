import React, {Component, PropTypes} from 'react'
import FileUpload from 'react-fileupload'
import TextField from 'material-ui/TextField'
import {Card} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import {indigo500, grey500} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

class ImageSearch extends Component {

  state = {
    images: [],
  }

  static propTypes = {
    searchImage: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const bottom = document.getElementById('scrollBottom')
    if (bottom && !this.state.loading &&
      this.state.images.length < this.state.totalResults &&
      this.scrolledToBottom(bottom)) {
      this.loadMore(Math.round(this.state.images.length / 50) + 1)
    }
  }

  scrolledToBottom = (bottom) => {
    return bottom.getBoundingClientRect().top < window.innerHeight
  }

  loadMore = (start) => {
    this.setState({loading: true})
    this.props.searchImage(this.state.imageQuery, start)
      .then(this.prepImages)
  }

  prepImages = (searchResults) => {
    this.setState((prevState) => {
      prevState.searched =  true
      prevState.loading = false
      prevState.totalResults = parseInt(searchResults.total, 10)
      if (prevState.totalResults === 0) {
        return prevState
      }
      prevState.images = prevState.images.concat(searchResults.photos.map((item) => {
        return {
          thumbnail: item.thumbnail,
          link: item.link,
        }
      }))
      return prevState
    })
  }

  onSearchClick = () => {
    this.props.searchImage(this.state.imageQuery)
      .then(this.prepImages)
    this.setState({loading: true})
    this.setState({images: []})
  }

  setImageQuery = (e) => {
    this.setState({imageQuery: e.target.value})
  }

  onUpload = (res) => {
    if (res.url) {
      this.props.updateRoom('image', image.link)
    }
  }

  render() {
    // const uploadOptions = {
    //   baseUrl: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/nametag_img_upload',
    //   chooseAndUpload: true,
    //   accept: '.jpg,.jpeg,.png',
    // }

    return <div style={styles.container}>
      <div style={styles.searchContainer}>
        <TextField
          onChange={this.setImageQuery}
          floatingLabelText='Search Flickr...'
          errorText={this.props.error}
          value={this.state.imageQuery}
          style={styles.searchField}/>
        <RaisedButton
          backgroundColor={indigo500}
          style={styles.button}
          labelStyle={styles.labelStyle}
          label='FIND IMAGE'
          onClick={this.onSearchClick}/>
      </div>
      <div style={styles.imagesContainer}>
        <Card
          style={{ ...styles.thumbnailContainer, ...styles.imageUpload}}>
              <IconButton
                style={styles.imageUploadButton}
                iconStyle={styles.imageUploadIcon}
                iconClassName="material-icons"
                ref="chooseAndUpload">
                cloud_upload
              </IconButton>
        </Card>
        {
          this.state.images.map((image, i) => {
            return <Card
              style={styles.thumbnailContainer}
              key ={i}
              onClick={() => this.props.updateRoom('image', image.link)}>
              <img src={image.thumbnail} style={styles.thumbnail}/>
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
        <div id='scrollBottom'/>
      </div>
    </div>
  }
}

export default ImageSearch

const styles = {
  button: {
    margin: 20,
  },
  labelStyle: {
    padding: '0px 10px',
    color: '#fff',
  },
  container: {
    marginTop: 10,
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchIcon: {
    verticalAlign: 'middle',
  },
  searchContainer: {
    width: '100%',
    display: 'flex',
    marginBottom: 10,
  },
  searchField: {
    borderRadius: 3,
    marginLeft: 10,
    flex: 1,
  },
  spinnerDiv: {
    margin: 20,
    textAlign: 'center',
  },
  thumbnail: {
    width: 150,
    height: 100,
    objectFit: 'cover',
  },
  thumbnailContainer: {
    margin: '10px 3px',
    width: 150,
    height: 100,
    minHeight: 100,
    cursor: 'pointer',
  },
  imagesContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    margin: 5,
    overflow: 'auto',
    height: 300,
  },
  noResults: {
    fontStyle: 'italic',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingBottom: 10,
  },
  imageUpload: {
    backgroundColor: grey500,
  },
  imageUploadButton: {
    width: 90,
    height: 100,
  },
  imageUploadIcon: {
    fontSize: 65,
    color: '#fff',
  },
}
