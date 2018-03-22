import React, {Component, PropTypes} from 'react'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import JoinedRoomCard from './JoinedRoomCard'
import StartRoomForm from './StartRoomForm'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {track, identify} from '../../utils/analytics'
import {white, grey, primary} from '../../../styles/colors'
import CircularProgress from 'material-ui/CircularProgress'
import t from '../../utils/i18n'

class RoomCards extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showLogin: false
    }

    this.toggleLogin = () => {
      this.setState({showLogin: !this.state.showLogin})
    }
  }

  componentWillMount () {
    const postAuth = window.sessionStorage.getItem('postAuth')
    if (postAuth) {
      window.sessionStorage.removeItem('postAuth')
      window.location = postAuth
    }
  }

  componentDidUpdate (oldProps) {
    const {data: {loading, me}} = this.props
    if (oldProps.data.loading && !loading) {
      if (me) {
        identify(me.id, {'$name': me.displayNames[0]})
      }
      track('ROOMCARDS_VIEW')
    }
  }

  render () {
    const {
      data: {me, loading, refetch}
    } = this.props

    if (loading) {
      return <div id='roomCards'>
        <div style={styles.spinner}>
          <CircularProgress />
        </div>
      </div>
    }
    return <div id='roomCards'>
      <Navbar me={me} toggleLogin={this.toggleLogin} />
      <div style={styles.background}>
        <div style={styles.container}>
          <div style={styles.joinedRooms}>
            <StartRoomForm />
            {
              me.nametags.length > 0 && <h3 style={styles.joinedRoomsHeader}>{t('room.room_convos')}</h3>
            }
            <div style={styles.joinedRoomContainer}>
              {
                me.nametags
                .filter(nametag => !!nametag.room && !nametag.banned)
                .sort((a, b) => {
                  if (b.room.newMessageCount === a.room.newMessageCount) {
                    return new Date(b.room.latestMessage).getTime() - new Date(a.room.latestMessage).getTime()
                  } else {
                    return b.room.newMessageCount - a.room.newMessageCount
                  }
                })
                .map(nametag => <JoinedRoomCard
                  key={nametag.id}
                  room={nametag.room} />)
              }
            </div>
          </div>
          <LoginDialog
            showLogin={this.state.showLogin}
            refetch={refetch}
            toggleLogin={this.toggleLogin} />
        </div>
      </div>
    </div>
  }
}

const {string, arrayOf, shape} = PropTypes

RoomCards.propTypes = {
  data: shape({
    me: shape({
      id: string.isRequired,
      nametags: arrayOf(shape({
        id: string.isRequired,
        room: shape({
          id: string.isRequired,
          title: string.isRequired,
          mod: shape({
            id: string.isRequired,
            image: string,
            name: string.isRequired
          })
        })
      })).isRequired
    }),
    rooms: arrayOf(
      shape({
        id: string.isRequired
      }).isRequired
    )
  })
}

export default radium(RoomCards)

const styles = {
  background: {
    background: '#fbfbfb',
    minHeight: '100vh',
    paddingBottom: 50,
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 800
  },
  joinedRoomsHeader: {
    marginLeft: 10,
    marginRight: 10
  },
  joinedRoomContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    [mobile]: {
      marginBottom: 0
    }
  },
  logo: {
    [mobile]: {
      width: 20
    }
  },
  title: {
    lineHeight: '46px',
    marginLeft: 7,
    fontWeight: 700,
    color: white,
    fontSize: 24,
    [mobile]: {
      fontSize: 14
    }
  },
  angle: {
    width: '100%',
    height: 50
  },
  firstRooms: {
    paddingTop: 50
  },
  roomCards: {
    paddingBottom: 50,
    paddingTop: 50
  },
  loginContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end'
  },
  login: {
    color: primary,
    margin: 5,
    fontSize: 18,
    cursor: 'pointer',
    marginRight: 40
  },
  hero: {
    width: '100%',
    height: window.innerWidth * 570 / 1023,
    background: 'url(https://s3.amazonaws.com/nametag_images/site/header3.jpg)',
    backgroundSize: 'cover'
  },
  heroText: {
    color: white,
    fontSize: 54,
    fontWeight: 300,
    padding: '10px 50px',
    width: '40%',
    height: window.innerWidth * 570 / 1023 - 20,
    background: 'linear-gradient(-90deg, rgba(0,0,0,0), rgba(0,0,0,0.7))',
    [mobile]: {
      fontSize: 22,
      padding: '5px 20px',
      height: window.innerWidth * 570 / 1023 - 10
    }
  },
  showMore: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    color: grey,
    cursor: 'pointer'
  },
  headerText: {
    margin: '10px 10px 20px 10px',
    textAlign: 'center',
    color: primary,
    fontSize: 28,
    [mobile]: {
      fontSize: 22
    }
  },
  bodyText: {
    fontSize: 22,
    maxWidth: 800,
    margin: '0px 10px 10px 10px',
    [mobile]: {
      fontSize: 16
    }
  },
  featuresHeader: {
    color: white,
    background: primary,
    margin: 0,
    padding: '10px 0px',
    width: '100%',
    textAlign: 'center'
  },
  featuresContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  featureCallouts: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    background: primary,
    width: '100%',
    paddingBottom: 20
  },
  featureFooter: {
    background: `linear-gradient(0deg, rgba(0,0,0,0), ${primary})`,
    height: 20,
    width: '100%',
    marginBottom: 20
  },
  buildBy: {
    textAlign: 'center',
    margin: 20,
    fontWeight: 300
  },
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  whoWeAreImage: {
    width: '80%',
    borderRadius: 3,
    marginTop: 3
  },
  whoWeAreContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  }
}
