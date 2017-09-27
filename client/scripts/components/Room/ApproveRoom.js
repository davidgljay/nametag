import React, {PropTypes, Component} from 'react'
import Login from '../User/Login'
import Alert from '../Utils/Alert'
import CircularProgress from 'material-ui/CircularProgress'

class ApproveRoom extends Component {

  constructor (props) {
    super(props)
    this.state = {
      error: null,
      approved: false
    }
  }

  componentDidMount () {
    const {params: {roomId}, approveRoom} = this.props
    approveRoom(roomId)
      .then(({data: {approveRoom: {errors}}}) => {
        if (errors[0]) {
          this.setState({error: errors[0].message})
        } else {
          this.setState({approved: true})
        }
      })
  }

  render () {
    const {data: {loading, me}, loginUser, registerUser, passwordResetRequest} = this.props
    const {error, approved} = this.state
    if (loading) {
      return <CircularProgress />
    }
    return <div style={styles.container}>
      <Alert alert={error} />
      {
        !me &&
        <Login
          loginUser={loginUser}
          registerUser={registerUser}
          passwordResetRequest={passwordResetRequest} />
      }
      {
        approved && <h1>Approved!</h1>
      }
    </div>
  }
}

const {func, object, shape, string} = PropTypes

ApproveRoom.proptypes = {
  roomApproval: func.isRequired,
  me: object.isRequired,
  params: shape({id: string.isRequired}).isRequired
}

export default ApproveRoom

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40
  }
}
