import React, {Component, PropTypes} from 'react'
import { CardActions, Icon, Button, Spinner, Grid, Cell } from 'react-mdl'

const styles = {
  button: {
    float: 'right',
    marginLeft: 10,
  },
  container: {
    marginTop: 10,
  },
  searchIcon: {
    verticalAlign: 'middle',
  },
  searchContainer: {
    width: '100%',
    display: 'flex',
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
    height: 150,
    objectFit: 'cover',
  },
  thumnailContainer: {
    margin: 5,
  },
  imagesContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
  },
}

class ImageSearch extends Component {

  constructor(props) {
    super(props)
    this.state = {
      images: [],
    }
    this.onSearchClick = this.onSearchClick.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.prepImages = this.prepImages.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    const bottom = document.getElementById('scrollBottom')
    if (bottom && !this.state.loading &&
      this.state.images.length < this.state.totalResults &&
      this.state.images.length + 10 < 100 &&
      this.scrolledToBottom(bottom)) {
      this.loadMore(this.state.images.length - 1)
    }
  }

  scrolledToBottom(bottom) {
    return bottom.getBoundingClientRect().top < window.innerHeight
  }

  loadMore(start) {
    this.setState({loading: true})
    this.props.searchImage(this.props.imageQuery, start)
      .then(this.prepImages)
  }

  prepImages(searchResults) {
    console.log(searchResults)
    this.setState((prevState) => {
      prevState.loading = false
      prevState.totalResults = parseInt(searchResults.searchInformation.totalResults)
      prevState.images = prevState.images.concat(searchResults.items.map((item) => {
        return item.image.thumbnailLink
      }))
      return prevState
    })
  }

  onSearchClick() {
    this.props.searchImage(this.props.imageQuery)
      .then(this.prepImages)
    this.props.searchImage(this.props.imageQuery, 10)
      .then(this.prepImages)
    this.setState({loading: true})
    this.setState({images: []})
  }

  render() {
    return <div style={styles.container}>
      <div style={styles.searchContainer}>
        <input type='text'
          onChange={this.props.setImageQuery}
          placeholder='Image search...'
          value={this.props.imageQuery}
          style={styles.searchField}/>
        <Button
          colored
          raised
          style={styles.button}
          onClick={this.onSearchClick}>Find an Image</Button>
      </div>
      <div style={styles.imagesContainer}>
        {this.state.images.map((imageUrl, i) => {
          return <div style={styles.thumnailContainer} key ={i}>
            <img src={imageUrl} style={styles.thumbnail}/>
            </div>
        })}
      </div>
      {
        this.state.loading &&
        <div style={styles.spinnerDiv}>
          <Spinner />
        </div>
      }
      <div id='scrollBottom'/>
    </div>
  }
}

ImageSearch.propTypes = {
  imageQuery: PropTypes.string,
  searchImage: PropTypes.func.isRequired,
}
export default ImageSearch
