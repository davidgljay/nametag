import React, {Component, PropTypes} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
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
    flex: 1,
    padding: 0,
    margin: '20px 20px 0px 20px',
  },
  button: {
    float: 'right',
    margin: 10,
  },
  textfieldContainer: {
    display: 'flex',
    width: '100%',
  },
  description: {
    flex: 1,
    margin: 0,
  },
  mainImage: {
    height: 300,
    cursor: 'pointer',
  },
}

class CreateRoom extends Component {

  constructor(props) {
    super(props)
    this.state = {
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
      this.setState({image: image, step: 'desc'})
    }
  }

  render() {
    return <div>
      <Navbar user={this.props.user} logout={this.props.logout}/>
      <Card shadow={1} style={styles.createRoomCard}>
        <ReactCSSTransitionGroup
          transitionName="fadeslide"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
        {
          this.state.image &&
          <CardTitle
            style={Object.assign({}, styles.mainImage, {background: 'url(' + this.state.image + ') center / cover'})}
            onClick={()=>this.setState({step: 'image'})} />

        }
        <div style={styles.textfieldContainer}>
          <Textfield
            style={styles.textfield}
            onChange={this.onNameChange}
            label="What would you like to talk about?"/>
        </div>
        {
          (this.state.desc || this.state.step === 'desc') &&
          <div style={styles.description}>
            <Textfield
              style={styles.textfield}
              value={this.props.desc}
              onChange={(e) => this.setState({desc: e.target.value})}
              label="Description"/>
          </div>
        }
        {
          this.state.step === 'desc' &&
            <Button
              colored
              raised
              onClick={() => this.setState({step: 'norms'})}
              style={styles.button}>
              Done
            </Button>
        }
        {
          this.state.name && !this.state.newRoom &&
          <Button
            colored
            raised
            style={styles.button}
            onClick={()=>{this.setState({step: 'image', newRoom: true})}}
            >Create New Room</Button>
        }
        {
          this.state.step === 'image' &&
          <ImageSearch
            searchImage={this.props.searchImage}
            setImageQuery={(e) => this.setState({imageQuery: e.target.value})}
            setImage={this.setImage}
            imageQuery={this.state.imageQuery}/>
        }
        </ReactCSSTransitionGroup>
      </Card>
    </div>
  }
}

CreateRoom.propTypes = {
  searchImage: PropTypes.func.isRequired,
}

export default CreateRoom
