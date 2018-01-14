import React, {Component, PropTypes} from 'react'
import FeatureCallout from './FeatureCallout'
import Navbar from '../Utils/Navbar'
import LoginDialog from '../User/LoginDialog'
import JoinedRoomCard from './JoinedRoomCard'
import ContactDialog from './ContactDialog'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {track, identify} from '../../utils/analytics'
import {white, grey} from '../../../styles/colors'
import CircularProgress from 'material-ui/CircularProgress'
import t from '../../utils/i18n'

class RoomCards extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showLogin: false,
      showAllJoined: false,
      contactReason: null
    }

    this.toggleLogin = () => {
      this.setState({showLogin: !this.state.showLogin})
    }

    this.closeContactDialog = () => {
      track('CLOSE_CONTACT')
      this.setState({contactReason: null})
    }

    this.openContactDialog = reason => () => {
      track('CONTACT', {reason})
      this.setState({contactReason: reason})
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
      data: {me, loading, refetch, contactForm}
    } = this.props
    const {contactReason} = this.state

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
    return <div id='roomCards'>
      <Navbar
        me={me}
        toggleLogin={this.toggleLogin} />
      <div style={styles.background}>
        {
          showAbout &&
          <div style={styles.header}>
            <div style={styles.headerText}>
              {t('room.header')}
            </div>
          </div>
        }
        <div style={styles.container}>
          {
            !showAbout &&
            <div style={styles.joinedRooms}>
              <h3 style={styles.joinedRoomsHeader}>{t('room.room_convos')}</h3>
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
                  {t('room.show_more')}
                </div>
              }
            </div>
          }
          {
            showAbout &&
            <div>
              <h2 style={styles.featureHeader}>{t('room.intimate')}</h2>
              <div id='FeatureCallouts' style={styles.featureCallouts} >
                {
                  [0, 1, 2].map(i =>
                    <FeatureCallout
                      key={i}
                      image={t(`room.feature_callouts.${i}.image`)}
                      title={t(`room.feature_callouts.${i}.title`)}
                      body={t(`room.feature_callouts.${i}.body`)} />
                  )
                }
              </div>
              <div style={styles.featureFooter}>
                {t('room.built_by')}
                <br />
                <br />
                <a href='https://medium.com/matter-driven-narrative/nametag-a-platform-for-building-relationships-fa977bca53ba' target='_blank'>{t('room.learn')}</a>
              </div>
            </div>
          }
          <LoginDialog
            showLogin={this.state.showLogin}
            refetch={refetch}
            toggleLogin={this.toggleLogin} />
          <ContactDialog
            contactForm={contactForm}
            reason={contactReason}
            closeDialog={this.closeContactDialog} />
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
