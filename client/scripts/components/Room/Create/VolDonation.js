import React, {Component, PropTypes} from 'react'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import NTIconMenu from '../../Nametag/IconMenu'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import FlatButton from 'material-ui/FlatButton'
import {grey, primary} from '../../../../styles/colors'
import constants from '../../../constants'
import Check from 'material-ui/svg-icons/navigation/check'
import t from '../../../utils/i18n'

class VolDonation extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showImageMenu: false,
      actionTypes: this.props.granters[0].defaultActionTypes
    }

    this.selectGranter = (e, i, granterId) => {
      const {updateRoom, granters} = this.props
      updateRoom('granter', granterId)
      const granter = granters.find(g => g.id === granterId)
      this.setState({actionTypes: granter && granter.defaultActionTypes || []})
    }

    // Transform updateRoom into the format expected by IconMenu.
    this.onImageUpload = (_, __, url) =>
      this.props.updateRoom('ctaImage', url)

    this.updateActionType = (index, type) => (e, value) => {
      const {updateRoom} = this.props
      const {actionTypes} = this.state
      const newActionTypes = actionTypes.slice()
      actionTypes[index] = {
        ...actionTypes[index],
        [type]: value
      }
      this.setState({actionTypes: newActionTypes})
      updateRoom('actionTypes', newActionTypes)
    }

    this.addActionType = () =>
      this.setState({
        actionTypes: this.state.actionTypes.concat({})
      })

    this.removeActionType = (i) => () =>
      this.setState({
        actionTypes: this.state.actionTypes.slice(0, i)
          .concat(this.state.actionTypes.slice(i + 1))
      })
  }

  render () {
    const {granters, room, email, updateRoom} = this.props
    const {showImageMenu, actionTypes} = this.state
    const granter = granters.find(g => g.id === room.granter)

    let stripeUrl
    if (granter) {
      stripeUrl = `https://connect.stripe.com/express/oauth/authorize?client_id=${constants.STRIPE_CLIENT_ID}`
      stripeUrl += `&state=${granter.urlCode}`
      stripeUrl += `&stripe_user[business_name]=${granter.name}`
      stripeUrl += `&stripe_user[email]=${email}`
    }

    return <div>
      <h1>{t('create_room.cta.add_call')}</h1>
      <div style={styles.header}>{t('create_room.cta.add_call_header')}</div>
      <div style={styles.enableDonationsContainer}>
        <div>{t('create_room.cta.enable_call')}</div>
        <DropDownMenu value={room.granter} onChange={this.selectGranter} style={styles.dropDown}>
          <MenuItem value={granters[0].id} primaryText='' />
          {
            granters.map(granter => <MenuItem
              key={granter.id}
              value={granter.id}
              primaryText={granter.name} />)
          }
        </DropDownMenu>
      </div>
      {
        granter &&
        <div style={styles.container}>
          <div style={styles.header}>{t('create_room.cta.personal')}</div>
          <div style={styles.ctaContainer}>
            <NTIconMenu
              image={granter.defaultCtaImages[0] || granter.image}
              images={[granter.image].concat(granter.defaultCtaImages)}
              about='room'
              showMenu={showImageMenu}
              toggleNametagImageMenu={(open) => this.setState({showImageMenu: open})}
              updateNametag={this.onImageUpload} />
            <TextField
              id='ctaText'
              value={room.ctaText || granter.defaultCtaText || granter.description}
              multiLine
              onChange={(e, val) => updateRoom('ctaText', val)}
              rows={2} />
          </div>
          <div>
            <div style={styles.header}>{t('create_room.cta.actions_avail')}</div>
            <div>
              {
                actionTypes.map((actionType, i) => <div key={i} style={styles.actionTypeContainer}>
                  <div style={styles.actionType}>
                    <TextField
                      id={`actionTitle${i}`}
                      value={actionType.title}
                      underlineShow={false}
                      onChange={this.updateActionType(i, 'title')}
                      style={styles.actionTitleStyle}
                      inputStyle={styles.actionTitle} />
                    <TextField
                      id={`actionDesc${i}`}
                      value={actionType.desc}
                      underlineShow={false}
                      onChange={this.updateActionType(i, 'desc')}
                      style={styles.actionDescStyle}
                      inputStyle={styles.actionDesc} />
                  </div>
                  <FontIcon
                    style={styles.actionTypeIcon}
                    className='material-icons'
                    onClick={this.removeActionType(i)}>
                    close
                    </FontIcon>
                </div>)
              }
              <FlatButton
                style={styles.addAction}
                label={t('create_room.cta.add_action')}
                icon={
                  <FontIcon
                    className='material-icons'>
                    add_circle
                  </FontIcon>
                }
                onClick={this.addActionType} />
            </div>
          </div>
          <div style={styles.donationContainer}>
            {
              granter.stripe
              ? <div style={styles.enableDonationsContainer}>
                <Check style={styles.check} />
                <div>{t('create_room.cta.donation_enabled')}</div>
              </div>
              : <div><a href={stripeUrl}>{t('create_room.cta.enable_donation')}</a></div>
            }
          </div>
        </div>
      }
    </div>
  }
}

const {string, arrayOf, shape, func} = PropTypes

VolDonation.propTypes = {
  granters: arrayOf(
    shape({
      name: string.isRequired
    })
  ),
  updateRoom: func.isRequired
}

export default VolDonation

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  enableDonationsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ctaContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    color: grey,
    fontSize: 14,
    margin: '30px 0px 10px 0px'
  },
  dropDown: {
    minWidth: 150
  },
  actionTypeContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  actionType: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
    background: '#f5f5f5',
    borderRadius: 3
  },
  actionTitle: {
    fontSize: '18px'
  },
  actionTitleStyle: {
    height: 28,
    padding: 5
  },
  actionDesc: {
    fontSize: '14px',
    color: grey
  },
  actionDescStyle: {
    height: 20,
    padding: 5
  },
  actionTypeIcon: {
    marginRight: 20,
    color: grey
  },
  addAction: {
    color: primary
  },
  donationContainer: {
    fontSize: 14,
    margin: 20
  },
  check: {
    color: primary
  }
}
