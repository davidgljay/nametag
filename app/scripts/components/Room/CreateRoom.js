import React, {Component, PropTypes} from 'react'
import { Card, CardTitle, CardActions, Textfield, Button } from 'react-mdl'
import ImageSearch from './ImageSearch'

const styles = {
  createRoomCard: {
    minHeight: 0,
    margin: 10,
    width: 'inherit',
    maxWidth: 620,
  },
  textfield: {
    fontSize: 24,
    border: 'none',
    margin: '20px 10px',
  },
  button: {
    float: 'right',
  },
  mainImage: {
    height: 300,
  },
}

class CreateRoom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      desc: '',
      imageQuery: '',
      image: '',
      norms: [],
      newRoom: false,
    }
    this.onNameChange = this.onNameChange.bind(this)
    this.setImage = this.setImage.bind(this)
  }

  onNameChange(e) {
    const name = e.target.value
    this.setState((prevState) => {
      if (!prevState.imageQuery || prevState.imageQuery === prevState.name) {
        prevState.imageQuery = name
      }
      prevState.name = name
      return prevState
    })
  }

  setImage(image) {
    return (e) => {
      e.preventDefault()
      this.setState({image: image})
    }
  }

  render() {
    return <div style={styles.container}>
      <Card shadow={1} style={styles.createRoomCard}>
        {
          this.state.image &&
          <CardTitle
            style={Object.assign({}, styles.mainImage, {background: 'url(' + this.state.image + ') center / cover'})}/>
        }
        <input type="text"
          style={styles.textfield}
          onChange={this.onNameChange}
          placeholder="What would you like to talk about?"/>
        {
          this.state.name.length > 0 && !this.state.newRoom &&
          <CardActions>
            <Button
              colored
              raised
              style={styles.button}
              onClick={()=>{this.setState({newRoom: true})}}
              >Create New Room</Button>
          </CardActions>
        }
        {
          this.state.newRoom &&
          <ImageSearch
            searchImage={this.props.searchImage}
            setImageQuery={(e) => this.setState({imageQuery: e.target.value})}
            setImage={this.setImage}
            imageQuery={this.state.imageQuery}/>
        }
      </Card>
    </div>
  }
}

CreateRoom.propTypes = {
  searchImage: PropTypes.func.isRequired,
}

export default CreateRoom
