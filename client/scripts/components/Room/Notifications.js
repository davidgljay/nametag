import React, {Component, PropTypes} from 'react'
import {List, ListItem} from 'material-ui/List'
import Badge from 'material-ui/Badge'
import {white} from '../../../styles/colors'
import NametagIcon from '../Nametag/NametagIcon'
import t from '../../utils/i18n'

class Notifications extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showMore: false
    }

    this.visitedRooms = (nametags) => nametags.filter(
      nametag => nametag.room && !nametag.banned &&
      nametag.room.id !== this.props.roomId
    )
    .sort((a, b) => {
      if (b.room.newMessageCount === a.room.newMessageCount) {
        return new Date(b.room.latestMessage).getTime() - new Date(a.room.latestMessage).getTime()
      } else {
        return b.room.newMessageCount - a.room.newMessageCount
      }
    })
  }

  componentWillMount () {
    const {latestMessageUpdatedSubscription, nametags} = this.props
    latestMessageUpdatedSubscription(this.visitedRooms(nametags).map(nt => nt.room.id))
  }

  render () {
    const {nametags} = this.props
    const visitedRooms = this.visitedRooms(nametags)

    const listItems = visitedRooms
        .slice(0, this.state.showMore ? nametags.length : 2)
        .map(nametag => {
          const room = nametag.room
          const mentions = nametag.mentions ? nametag.mentions.filter(
            time => new Date(time) > new Date(nametag.latestVisit)
          ).length : 0

          const newMessages = room.latestMessage > nametag.latestVisit
          const notificationStyle = newMessages ? styles.notification
          : {...styles.notification, ...styles.noNewMessages}
          return <ListItem innerDivStyle={notificationStyle} key={room.id} className='roomNotif'>
            <a href={`/rooms/${room.id}`} style={styles.link}>
              {
                mentions > 0 &&
                <Badge
                  badgeContent={mentions}
                  secondary
                  style={styles.badgeStyle}
                  badgeStyle={styles.innerBadgeStyle} />
              }
              <div>
                <NametagIcon
                  name={room.mod.name}
                  image={room.mod.image}
                  diameter={40}
                  marginRight={10} />
              </div>
              <div className='roomTitle'>{room.title}</div>
            </a>
          </ListItem>
        })

    return <div>
      {
        listItems.length > 0 &&
        <div>
          <List
            children={listItems} />
        </div>
      }
      {
        !this.state.showMore &&
        visitedRooms.length > 2 &&
        <div
          style={styles.showMore}
          onClick={() => this.setState({showMore: true})}>
          {t('room.show_more')}
        </div>
      }
    </div>
  }
}

const {string, arrayOf, shape, func} = PropTypes

Notifications.propTypes = {
  roomId: string,
  nametags: arrayOf(shape({
    room: shape({
      id: string.isRequired,
      title: string.isRequired
    })
  })).isRequired,
  latestMessageUpdatedSubscription: func.isRequired
}

export default Notifications

const styles = {
  listStyle: {
    width: '100%'
  },
  flexDisplay: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  flexDisplayMobile: { // Necessary b/c Radium can't act on custom components
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  noNewMessages: {
    color: 'rgb(210, 210, 210)'
  },
  notification: {
    margin: 5,
    color: '#FFF',
    padding: '8px 8px 4px 8px',
    borderRadius: 2,
    fontSize: 13
  },
  roomImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    objectFit: 'cover',
    borderRadius: 15
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
    fontWeight: 300,
    display: 'flex',
    alignItems: 'center'
  },
  badgeStyle: {
    position: 'fixed',
    top: 3,
    left: 22,
    zIndex: 20,
    padding: 0,
    borderRadius: 5
  },
  innerBadgeStyle: {
    fontSize: 10,
    width: 15,
    height: 15
  },
  activeRooms: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  showMore: {
    fontSize: 11,
    fontWeight: 300,
    cursor: 'pointer',
    fontStyle: 'italic',
    color: white,
    textAlign: 'center'
  }
}
