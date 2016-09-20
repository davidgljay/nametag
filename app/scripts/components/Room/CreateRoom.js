import React, { Component, PropTypes } from 'react'
import { Card, CardActions, Textfield, Button } from 'react-mdl'

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
  },
  button: {
    float: 'right',
  },
}

class CreateRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room: {
        title: '',
        description: '',
        image: '',
        mod: '',
        badges: [],
      },
      mod: {
        name: '',
        bio: '',
        badges: [],
      },
    }
  }

  render() {
    // TODO: Add dynamic image loading
    return <div style={styles.container}>
      <Card shadow={1} style={styles.createRoomCard}>
        <Textfield
          style={styles.textfield}
          onChange={() => {}}
          label="What do you want to talk about?"/>
        <CardActions>
          <Button style={styles.button} colored ripple>Start a Conversation</Button>
        </CardActions>
      </Card>
    </div>
  }
}

export default CreateRoom
