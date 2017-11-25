import React, {Component, PropTypes} from 'react'
import Navbar from '../Utils/Navbar'
import CircularProgress from 'material-ui/CircularProgress'
import {red} from '../../../styles/colors'
import {track} from '../../utils/analytics'
import t from '../../utils/i18n'

class EmailConfirm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      errors: null,
      complet: false
    }
  }

  componentWillMount () {
    const {params, emailConfirmation} = this.props
    track('EMAIL_CONFIRMATION')
    emailConfirmation(params.token)
      .then(res => {
        this.setState({complete: true})
        if (res.data.emailConfirmation && res.data.emailConfirmation.errors) {
          this.setState({errors: res.data.emailConfirmation.errors})
        } else {
          setTimeout(() => {
            window.location = '/'
          }, 1000)
        }
      })
  }

  render () {
    const {complete, errors} = this.state
    return <div>
      <Navbar
        empty />
      <div style={styles.emailConfirmationContainer}>
        {
          complete && !errors &&
          <div style={styles.emailConfirmationContainer}>
            <h3>{t('user.em_confirmed')}</h3>
            <CircularProgress />
          </div>
        }
        {
          complete && errors &&
          <div style={styles.errorsContainer}>
            {
              errors.map(err => <h4 key={err.message}>{err.message}</h4>)
            }
          </div>
        }
        {
          !complete &&
          <CircularProgress />
        }
      </div>
    </div>
  }
}

const {func, shape, string} = PropTypes
EmailConfirm.propTypes = {
  emailConfirmation: func.isRequired,
  params: shape({
    token: string.isRequired
  }).isRequired
}

export default EmailConfirm

const styles = {
  emailConfirmationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20
  },
  errorsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: red
  }
}
