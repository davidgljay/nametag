import React, {Component, PropTypes} from 'react'
import { Textfield, Icon, Button } from 'react-mdl'

class ImageSearch extends Component {

  constructor(props) {
    super(props)
    this.onQueryChange = this.onQueryChange.bind(this)
    this.onSearchClick = this.onSearchClick.bind(this)
  }

  onQueryChange(e) {
    e.preventDefault()
    this.props.setRoomProp('new', 'imageQuery', e.target.value)
  }

  onSearchClick() {
    this.props.searchImage(this.props.imageQuery)
      .then((result) => {
        console.log(result)
      })
  }

  render() {
    return <div>
      <Icon name='search'/>
      <Textfield
        onChange={this.onQueryChange}
        label="Text..."/>
      <Button
        raised
        onClick={this.onSearchClick}>Search</Button>
    </div>
  }
}

ImageSearch.propTypes = {
  imageQuery: PropTypes.string,
  setRoomProp: PropTypes.func.isRequired,
  searchImage: PropTypes.func.isRequired,
}
export default ImageSearch
