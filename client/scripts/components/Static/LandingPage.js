import React, {Component} from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import t from '../../utils/i18n'
import {contactForm} from '../../actions/RoomActions'
import FeatureCallout from '../Room/FeatureCallout'
import LoginDialog from '../User/LoginDialog'
import ContactDialog from '../Room/ContactDialog'
import radium from 'radium'
import {mobile} from '../../../styles/sizes'
import {track} from '../../utils/analytics'
import {white, primary} from '../../../styles/colors'

class LandingPage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      showLogin: false,
      showAllJoined: false,
      contactReason: null
    }

    this.toggleLogin = () => {
      track('SHOW_LOGIN')
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

  render () {
    const {contactForm} = this.props
    const {contactReason} = this.state
    return <div>
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <div style={styles.titleContainer}>
            <img style={styles.logo} src='https://s3.amazonaws.com/nametag_images/site/nametag_inverted.png' />
            <div style={styles.title}>Nametag</div>
          </div>
          {t('homepage.header')}
        </div>
      </div>
      <div style={styles.container}>
        <div style={styles.loginContainer}>
          <div style={styles.login} onClick={this.toggleLogin}>{t('login.login')}</div>
        </div>
        <h2 style={styles.headerText}>{t('homepage.reach')}</h2>
        <div style={styles.bodyText}>
          <p>
            {t('homepage.description[0]')}
          </p>
          <p>
            {t('homepage.description[1]')}
          </p>
        </div>
        <div style={styles.featuresContainer} >
          <img src='https://s3.amazonaws.com/nametag_images/site/angle.svg' style={styles.angle} />
          <h2 style={styles.featuresHeader}>How Nametag Works</h2>
          <div id='FeatureCallouts' style={styles.featureCallouts} >
            {
              [0, 1, 2].map(i =>
                <FeatureCallout
                  key={i}
                  image={t(`homepage.works_callouts.${i}.image`)}
                  title={t(`homepage.works_callouts.${i}.title`)}
                  body={t(`homepage.works_callouts.${i}.body`)} />
              )
            }
          </div>
          <img src='https://s3.amazonaws.com/nametag_images/site/angle2.svg' style={styles.angle} />
        </div>
        <div style={styles.buttonContainer}>
          <RaisedButton primary label={t('room.try_it')} onClick={() => { window.location = '/r/nametagdemoc35' }} />
        </div>
        <div style={styles.whoWeAreContainer}>
          <h2 style={styles.headerText}>{t('homepage.who')}</h2>
          <div style={styles.bodyText}>
            <img src='https://s3.amazonaws.com/nametag_images/site/DJ_wideshot_300.jpg' style={styles.djImage} />
            {[0, 1, 2, 3].map(i => <p>{t(`homepage.built_by[${i}]`)}</p>)}
          </div>
          <div style={styles.buttonContainer}>
            <FlatButton label={t('room.contact')} onClick={this.openContactDialog('contactForm')} />
          </div>
        </div>
      </div>
      <LoginDialog
        showLogin={this.state.showLogin}
        refetch={window.location.reload}
        toggleLogin={this.toggleLogin} />
      <ContactDialog
        contactForm={contactForm}
        reason={contactReason}
        closeDialog={this.closeContactDialog} />
    </div>
  }
}

const mapDispatchToProps = dispatch => {
  const disp = (func) => (...args) => dispatch(func.apply(this, args))
  return {
    contactForm: disp(contactForm)
  }
}

export default connect(() => ({}), mapDispatchToProps)(radium(LandingPage))

const styles = {
  background: {
    background: '#fbfbfb',
    minHeight: '100vh',
    paddingBottom: 50
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '20px 0px'
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
  },
  djImage: {
    borderRadius: 3,
    margin: 15,
    float: 'left'
  }
}
