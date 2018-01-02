import React, {Component, PropTypes} from 'react'
import Navbar from '../Utils/Navbar'
import GranterInfo from './GranterInfo'
import BadgeRequest from '../Badge/BadgeRequest'
import Template from '../Badge/Template'
import CircularProgress from 'material-ui/CircularProgress'
import LoginDialog from '../User/LoginDialog'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'
import t from '../../utils/i18n'

class Granter extends Component {

  componentDidMount () {
    const {requestNotifPermissions, updateToken} = this.props
    requestNotifPermissions(updateToken)
  }

  componentDidUpdate (prevProps) {
    const {loading, granter} = this.props.data
    if (prevProps.data.loading && !loading) {
      this.props.badgeRequestAddedSubscription(granter.id)
    }
  }

  render () {
    const {
      data: {granter, me, loading, error},
      createBadge,
      updateBadgeRequestStatus,
      addNote
    } = this.props

    if (error && error.message === 'GraphQL Error: Not Logged In') {
      return <div>
        <LoginDialog
          showLogin
          message={t('granter.login_to_view')} />
      </div>
    } else if (error) {
      return <h2>
        {
          error.message
        }
      </h2>
    }

    return loading
      ? <CircularProgress style={styles.spinner} />
      : <div>
        <Navbar me={me} />
        <div id='granterDetail' style={styles.granterDetail}>
          <GranterInfo granter={granter} me={me} />
          <ReactCSSTransitionGroup
            transitionName='fade'
            style={styles.badgeRequests}
            transitionEnterTimeout={2000}
            transitionLeaveTimeout={1500}>
            {
              granter.badgeRequests.map(badgeRequest =>
                <div
                  key={badgeRequest.id}>
                  <BadgeRequest
                    badgeRequest={badgeRequest}
                    createBadge={createBadge}
                    updateBadgeRequestStatus={updateBadgeRequestStatus} />
                </div>
              )
            }
          </ReactCSSTransitionGroup>
          <div style={styles.createButtonContainter}>
            <FlatButton
              href={`/granters/${granter.urlCode}/badges/create`}
              label={t('badge.create_badge')}
              labelPosition='before'
              icon={
                <FontIcon
                  className='material-icons'>
                  add_circle
                </FontIcon>
              }
              primary />
          </div>
          <div>
            {
              granter.templates.map(template =>
                <Template
                  addNote={addNote}
                  key={template.id}
                  template={template} />
              )
            }
          </div>
        </div>
      </div>
  }
}

const {shape, string, object, arrayOf, func, bool} = PropTypes

Granter.propTypes = {
  data: shape({
    loading: bool.isRequired,
    granter: shape({
      badgeRequests: arrayOf(object.isRequired).isRequired,
      templates: arrayOf(object.isRequired).isRequired
    }),
    me: shape({
      id: string.isRequired
    })
  }).isRequired,
  createBadge: func.isRequired,
  addNote: func.isRequired,
  updateBadgeRequestStatus: func.isRequired
}

export default radium(Granter)

const styles = {
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  },
  badgeRequests: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  granterDetail: {
    paddingLeft: '20%',
    paddingRight: '20%',
    [mobile]: {
      paddingLeft: '5%',
      paddingRight: '5%'
    }
  },
  createButtonContainter: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}
