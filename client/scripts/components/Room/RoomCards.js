import React, {Component, PropTypes} from 'react'
import RoomCard from './RoomCard'
import FeatureCallout from './FeatureCallout'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import JoinedRoomCard from './JoinedRoomCard'
import StartRoomForm from './StartRoomForm'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {track, identify} from '../../utils/analytics'
import {white, grey} from '../../../styles/colors'
import CircularProgress from 'material-ui/CircularProgress'

class RoomCards extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showLogin: false,
      showAllJoined: false
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
      data: {me, rooms, loading}
    } = this.props

    if (loading) {
      return <div id='roomCards'>
        <Navbar
          me={me}
          toggleLogin={this.toggleLogin} />
        <div style={styles.spinner}>
          <CircularProgress />
        </div>
      </div>
    }
    const {showAllJoined} = this.state
    const showAbout = !me || me.nametags.length === 0
    let nametagHash = {}
    if (me) {
      nametagHash = me.nametags.reduce((hash, nametag) => {
        if (!nametag.room) {
          return hash
        }
        hash[nametag.room.id] = nametag
        return hash
      }, {})
    }
    return <div id='roomCards'>
      <Navbar
        me={me}
        toggleLogin={this.toggleLogin} />
      <div style={styles.background}>
        {
          showAbout &&
          <div style={styles.header}>
            <div style={styles.headerText}>
              Online conversation that feels like an intimate dinner party.
            </div>
          </div>
        }
        <div style={styles.container}>
          <StartRoomForm loggedIn={!!me && me.nametags.length > 0} />
          {
            !showAbout &&
            <div style={styles.joinedRooms}>
              <h3 style={styles.joinedRoomsHeader}>Your Conversations</h3>
              <div style={styles.joinedRoomContainer}>
                {
                  me.nametags
                  .filter(nametag => !!nametag.room && !nametag.banned)
                  .sort((a, b) => {
                    if (b.room.newMessageCount === a.room.newMessageCount) {
                      return new Date(b.latestVisit).getTime() - new Date(a.latestVisit).getTime()
                    } else {
                      return b.room.newMessageCount - a.room.newMessageCount
                    }
                  })
                  .slice(0, showAllJoined ? me.nametags.length : 4)
                  .map(nametag => <JoinedRoomCard
                    key={nametag.id}
                    room={nametag.room} />)
                }
              </div>
              {
                !showAllJoined &&
                me.nametags.filter(nametag => !!nametag.room && !nametag.banned).length > 4 &&
                <div
                  style={styles.showMore}
                  onClick={() => this.setState({showAllJoined: true})}>
                  Show More
                </div>
              }
            </div>
          }
          {
            showAbout &&
            <div>
              <div id='firstRooms' style={styles.firstRooms}>
                {
                  rooms &&
                  rooms.length > 0 &&
                  rooms
                  .filter(room => !nametagHash[room.id])
                  .slice(0, 2)
                  .map((room, i) => {
                    let banned = false
                    if (me) {
                      const myNametag = me.nametags.find(nt => nt.room && nt.room.id === room.id)
                      banned = !!myNametag && myNametag.banned
                    }
                    return <RoomCard
                      key={room.id}
                      room={room}
                      disabled={banned || room.closed}
                      me={me}
                      style={i === 1 && showAbout ? {marginBottom: 10} : {}} />
                  }
                  )
                }
              </div>
              <h2 style={styles.featureHeader}>Chat Built For Intimate Conversation</h2>
              <div id='FeatureCallouts' style={styles.featureCallouts} >
                <FeatureCallout
                  image='https://s3.amazonaws.com/nametag_images/site/welcoming.jpg'
                  title='Welcoming'
                  body='Everyone who enters a room introduces themselves, so you know what perspective they bring.' />
                <FeatureCallout
                  image='https://s3.amazonaws.com/nametag_images/site/kayak.jpg'
                  title='Focused'
                  body='All conversations have a moderator and a shared set of norms to keep them focused on what matters.' />
                <FeatureCallout
                  image='https://s3.amazonaws.com/nametag_images/site/intimate.jpg'
                  title='Confidential'
                  body={'Limit conversations to people you trust, we keep what you say and where you say it private.'} />
              </div>
              <div style={styles.featureFooter}>
                Nametag is built by folks who want better ways to build trust on the internet.
                <br />
                <br />
                <a href='https://medium.com/matter-driven-narrative/nametag-a-platform-for-building-relationships-fa977bca53ba' target='_blank'>Learn More</a>
              </div>
            </div>
          }
          <div style={styles.roomCards}>
            {
              rooms &&
              rooms.length > 0 &&
              rooms
              .filter(room => !nametagHash[room.id])
              .slice(showAbout ? 2 : 0)
              .map(room => {
                let banned = false
                if (me) {
                  const myNametag = me.nametags.find(nt => nt.room && nt.room.id === room.id)
                  banned = !!myNametag && myNametag.banned
                }
                return <RoomCard
                  key={room.id}
                  room={room}
                  disabled={banned || room.closed}
                  me={me} />
              }
              )
            }
          </div>
          <LoginDialog
            showLogin={this.state.showLogin}
            toggleLogin={this.toggleLogin}
            message='Log In or Register' />
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
    minHeight: '100vh'
  },
  container: {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto'
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
  firstRooms: {
    paddingTop: 50
  },
  roomCards: {
    paddingBottom: 50,
    paddingTop: 50
  },
  header: {
    width: '100%',
    height: window.innerWidth * 494 / 1023,
    background: 'url(https://s3.amazonaws.com/nametag_images/site/nametag-header.png)',
    backgroundSize: 'cover',
    marginBottom: 40
  },
  headerText: {
    color: white,
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 300,
    padding: 10,
    paddingTop: window.innerWidth * 494 / 1023 - 80,
    [mobile]: {
      fontSize: 22
    }
  },
  showMore: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    color: grey,
    cursor: 'pointer'
  },
  featureHeader: {
    margin: '40px 10px 0px 10px',
    textAlign: 'center'
  },
  featureCallouts: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  featureFooter: {
    textAlign: 'center',
    margin: '20px 10px',
    fontWeight: 300
  },
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  }
}
