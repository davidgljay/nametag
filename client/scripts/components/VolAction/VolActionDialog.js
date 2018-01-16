import React, {Component, PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'
import FontIcon from 'material-ui/FontIcon'
import {List, ListItem} from 'material-ui/List'
import NametagIcon from '../Nametag/NametagIcon'
import {primary} from '../../../styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import ChooseAmount from '../Donation/ChooseAmount'
import StripeCheckout from '../Donation/StripeCheckout'
import {injectStripe} from 'react-stripe-elements'
import t from '../../utils/i18n'

class VolActionDialog extends Component {

  constructor (props) {
    super(props)

    this.state = {
      checkedActions: [],
      donated: false,
      singedUp: false,
      amount: null
    }

    this.selectAmount = (amount) => () => this.setState({amount})

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
      const {checkedActions, amount} = this.state
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

      let promises = []
      if (checkedActions.length > 0) {
        promises.push(
          createVolActions(checkedActions, myNametag.id, null)
            .then(this.setState({signedUp: true}))
        )
      }

      if (granter.stripe && amount) {
        promises.push(
          stripe.createToken({
            type: 'card',
            email
          })
          .then(res => createDonation(amount, myNametag.id, res.token.id))
        )
      }

      Promise.all(promises)
        .then(() => this.setState({signedUp: true}))
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
    const {checkedActions, donated, signedUp, amount} = this.state
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
                      createDonation={createDonation} />
                  </div>
                }
              </div>
            }
            <div style={styles.buttonContainer}>
              <RaisedButton
                primary
                onClick={this.onSignupClick}
                label={t('room.sign_up')} />
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
  }
}
