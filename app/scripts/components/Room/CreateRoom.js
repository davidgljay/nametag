import React, {Component, PropTypes} from 'react'
import { Card, CardActions, Textfield, Button } from 'react-mdl'
import ImageSearch from './ImageSearch'

const styles = {
  createRoomCard: {
    minHeight: 0,
    margin: 10,
    width: 'inherit',
    maxWidth: 620,
    padding: '5px 20px 5px 20px',
  },
  textfield: {
    width: '100%',
    fontSize: 24,
    border: 'none',
  },
  button: {
    float: 'right',
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

  render() {
    return <div style={styles.container}>
      <Card shadow={1} style={styles.createRoomCard}>
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
