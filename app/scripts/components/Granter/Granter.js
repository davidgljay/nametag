import React, {Component, PropTypes} from 'react'
import NavBar from '../utils/NavBar'
import GranterInfo from './GranterInfo'
import CircularProgress from 'material-ui/CircularProgress'

class Granter extends Component {

  render () {
    const {data: {granter, me, loading}} = this.props
    console.log('granter', granter)
    return loading
    ? <CircularProgress style={styles.spinner} />
    : <div id='granterDetail'>
      <NavBar me={me} />
      <GranterInfo granter={granter} />
      {
        // <div>
        //   <GranterNotifications
        //     notifications={granter.badgeRequests}
        //     createBadge={createBadge}
        //     updateBadgeRequestStatus={updateBadgeRequestStatus}
        //     />
        //   <BadgeTemplates
        //     templates={granter.templates}/>
        // </div>
      }
    </div>
  }
}

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

export default Granter

const styles = {
  spinner: {
    marginLeft: '45%',
    marginTop: '40vh'
  }
}
