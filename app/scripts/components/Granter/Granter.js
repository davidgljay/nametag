import React, {PropTypes} from 'react'
import NavBar from '../utils/NavBar'
import GranterInfo from './GranterInfo'
import BadgeRequest from '../Badge/BadgeRequest'
import CircularProgress from 'material-ui/CircularProgress'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'

const Granter = ({data: {granter, me, loading}, createBadge, updateBadgeRequestStatus}) =>
  loading
    ? <CircularProgress style={styles.spinner} />
    : <div>
      <NavBar me={me} />
      <div id='granterDetail' style={styles.granterDetail}>
        <GranterInfo granter={granter} />
        <div id='badgeRequests' style={styles.badgeRequests}>
          {
            granter.badgeRequests.map(badgeRequest =>
              <BadgeRequest
                key={badgeRequest.id}
                badgeRequest={badgeRequest}
                createBadge={createBadge}
                updateBadgeRequestStatus={updateBadgeRequestStatus} />
            )
          }
        </div>
        {
          // <div>

          //   <BadgeTemplates
          //     templates={granter.templates}/>
          // </div>
        }
      </div>
    </div>

Granter.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    granter: PropTypes.shape({
      badgeRequests: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
      templates: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
    }),
    me: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  createBadge: PropTypes.func.isRequired,
  updateBadgeRequestStatus: PropTypes.func.isRequired
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
  }
}
