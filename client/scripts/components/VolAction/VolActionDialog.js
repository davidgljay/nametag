import React, {Component, PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'
import FontIcon from 'material-ui/FontIcon'
import {List, ListItem} from 'material-ui/List'
import NametagIcon from '../Nametag/NametagIcon'
import {primary, grey} from '../../../styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import ChooseAmount from '../Donation/ChooseAmount'
import CircularProgress from 'material-ui/CircularProgress'
import StripeCheckout from '../Donation/StripeCheckout'
import {injectStripe} from 'react-stripe-elements'
import TextField from 'material-ui/TextField'
import t from '../../utils/i18n'

class VolActionDialog extends Component {

  constructor (props) {
    super(props)

    this.state = {
      checkedActions: [],
      donated: false,
      singedUp: false,
      amount: null,
      name: '',
      occupation: '',
      employer: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      donationInfoMissing: false
    }

    this.selectAmount = amount => () => this.setState({amount})

    this.setDonationInfo = field => (e, value) => this.setState({[field]: value})

    this.addAction = (action) => () =>
      this.setState({
        checkedActions: this.state.checkedActions.concat(action.title)
      })

    this.removeAction = (action) => () => this.setState(prevState => {
      const index = prevState.checkedActions.indexOf(action.title)
      prevState.checkedActions = prevState.checkedActions
        .slice(0, index)
        .concat(prevState.checkedActions.slice(index + 1))
      return prevState
    })

    this.onSignupClick = () => {
      const {
        checkedActions,
        amount,
        name,
        occupation,
        employer,
        address1,
        address2,
        city,
        state,
        zip
      } = this.state
      const {
        createDonation,
        createVolActions,
        myNametag,
        email,
        granter,
        stripe
      } = this.props

      if (checkedActions.length === 0 && !amount) {
        return
      }

      if (granter.type === 'CAMPAIGN' && (
        !name || !occupation || !employer || !address1 || !address2 ||
        !city || !state || !zip
      ) && amount) {
        this.setState({donationInfoMissing: true})
        return
      }

      this.setState({loadingSignup: true})

      let promises = []
      if (checkedActions.length > 0) {
        promises.push(
          createVolActions(checkedActions, myNametag.id, null)
            .then(this.setState({signedUp: true}))
        )
      }

      if (granter.stripe && amount && amount > 0) {
        promises.push(
          stripe.createToken({
            type: 'card',
            email
          })
          .then(res => createDonation(
            {
              amount,
              token: res.token.id,
              name,
              occupation,
              employer,
              address1,
              address2,
              city,
              state,
              zip
            },
            myNametag.id,
          ))
        )
      }

      Promise.all(promises)
        .then(() => this.setState({signedUp: true, loadingSignup: false}))
        .catch((e) => {
          this.setState({loadingSignup: false, signedUp: false})
          return e
        })
    }

    this.setDonated = () => { this.setState({donated: true}) }
  }

  render () {
    const {
      open,
      closeDialog,
      stripe,
      createDonation,
      myNametag,
      room: {
        ctaImage,
        ctaText,
        thankText,
        actionTypes,
        granter
      }
      } = this.props
    const {
      checkedActions,
      donated,
      signedUp,
      amount,
      loadingSignup,
      name,
      occupation,
      employer,
      address1,
      address2,
      city,
      state,
      zip,
      donationInfoMissing
    } = this.state
    const text = signedUp ? thankText : ctaText

    return <div>
      <Dialog
        modal={false}
        contentStyle={styles.dialog}
        bodyStyle={styles.bodyStyle}
        open={open}
        onRequestClose={closeDialog}>
        <FontIcon
          onClick={closeDialog}
          style={styles.closeIcon}
          className='material-icons'>
          close
        </FontIcon>
        <div style={styles.cta}>
          <NametagIcon
            image={ctaImage}
            name={granter.name}
            diameter={50}
            marginRight={20} />
          <div style={text.length > 80 ? styles.ctaText : styles.bigText}>
            {text}
          </div>
        </div>
        {
          signedUp
          ? <div style={styles.buttonContainer}>
            <RaisedButton
              primary
              onClick={closeDialog}
              label={t('room.close')} />
          </div>
          : <div>
            <List style={styles.actionTypes}>
              {
                actionTypes.map((action, i) => {
                  const checked = checkedActions.indexOf(action.title) > -1
                  const icon = checked
                    ? <FontIcon
                      style={styles.check}
                      className='material-icons'>
                        check_box
                      </FontIcon>
                    : <FontIcon
                      className='material-icons'>
                        check_box_outline_blank
                      </FontIcon>
                  return <ListItem
                    key={i}
                    onClick={checked ? this.removeAction(action) : this.addAction(action)}
                    primaryText={action.title}
                    secondaryText={action.desc}
                    innerDivStyle={checked ? styles.checkedAction : styles.uncheckedAction}
                    leftIcon={icon}
                    style={styles.action} />
                })
              }
            </List>
            {
              granter.stripe && <div>
                {
                  donated
                  ? <h3>Thank you for your donation</h3>
                  : <div style={styles.donationContainer}>
                    <h3>Can you also make a donation?</h3>
                    <ChooseAmount
                      selectAmount={this.selectAmount}
                      selectedAmount={amount} />
                    <StripeCheckout
                      amount={amount}
                      stripe={stripe}
                      setDonated={this.setDonated}
                      myNametagId={myNametag.id}
                      granterType={granter.type}
                      createDonation={createDonation}
                      name={name}
                      occupation={occupation}
                      employer={employer}
                      address1={address1}
                      address2={address2}
                      city={city}
                      state={state}
                      zip={zip} />
                    {
                      granter.type === 'CAMPAIGN' && amount &&
                      <div style={styles.donationInfoContainer}>
                        <div style={styles.helpText}>
                          Thanks for donating! For legal reasons, we need the following information to process your donation.
                        </div>
                        <TextField
                          floatingLabelText='Name'
                          value={name}
                          errorText={donationInfoMissing && !name && 'Required'}
                          onChange={this.setDonationInfo('name')} />
                        <TextField
                          floatingLabelText='Occupation'
                          value={occupation}
                          errorText={donationInfoMissing && !occupation && 'Required'}
                          onChange={this.setDonationInfo('occupation')} />
                        <TextField
                          floatingLabelText='Employer'
                          value={employer}
                          errorText={donationInfoMissing && !employer && 'Required'}
                          onChange={this.setDonationInfo('employer')} />
                        <TextField
                          floatingLabelText='Address 1'
                          value={address1}
                          errorText={donationInfoMissing && !address1 && 'Required'}
                          onChange={this.setDonationInfo('address1')} />
                        <TextField
                          floatingLabelText='Address 2'
                          value={address2}
                          onChange={this.setDonationInfo('address2')} />
                        <div>
                          <TextField
                            floatingLabelText='City'
                            value={city}
                            style={styles.cityField}
                            errorText={donationInfoMissing && !city && 'Required'}
                            onChange={this.setDonationInfo('city')} />
                          <TextField
                            floatingLabelText='State'
                            value={state}
                            style={styles.stateField}
                            errorText={donationInfoMissing && !state && 'Required'}
                            onChange={this.setDonationInfo('state')} />
                          <TextField
                            floatingLabelText='Zip'
                            style={styles.zipField}
                            value={zip}
                            errorText={donationInfoMissing && !zip && 'Required'}
                            type='number'
                            onChange={this.setDonationInfo('zip')} />
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
            <div style={styles.buttonContainer}>
              {
                loadingSignup
                ? <CircularProgress />
                : <RaisedButton
                  primary
                  onClick={this.onSignupClick}
                  label={amount ? t('room.sign_up_donate') : t('room.sign_up')} />
              }
            </div>
          </div>
        }

      </Dialog>
    </div>
  }
}

const {string, arrayOf, shape, bool, func} = PropTypes

VolActionDialog.propTypes = {
  open: bool.isRequired,
  actions: arrayOf(shape({
    title: string.isRequired,
    description: string.isRequired
  }).isRequired),
  room: shape({
    ctaImage: string.isRequired,
    ctaText: string.isRequired,
    thankText: string.isRequired,
    granter: shape({
      stripe: string,
      name: string.isRequired
    }).isRequired
  }),
  email: string.isRequired,
  closeDialog: func.isRequired,
  createVolActions: func.isRequired,
  myNametag: shape({
    id: string.isRequired
  }).isRequired
}

export default injectStripe(VolActionDialog)

const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20
  },
  bodyStyle: {
    overflowY: 'auto'
  },
  cta: {
    display: 'flex'
  },
  ctaText: {
    flex: 1
  },
  bigText: {
    flex: 1,
    fontSize: '24px'
  },
  closeIcon: {
    float: 'right',
    cursor: 'pointer'
  },
  check: {
    color: primary
  },
  checkedAction: {
    color: primary,
    background: 'rgba(18, 114, 106, .25)'
  },
  donationContainer: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  donationInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20
  },
  cityField: {
    width: 150,
    margin: '0px 10px'
  },
  stateField: {
    width: 60,
    margin: '0px 10px'
  },
  zipField: {
    width: 80,
    margin: '0px 10px'
  },
  helpText: {
    color: grey,
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 30,
    width: '100%'
  }
}
