import React, {Component, PropTypes} from 'react'
import {CardElement} from 'react-stripe-elements'

class StripeCheckout extends Component {

  constructor (props) {
    super(props)

    this.setPaymentRequest = () => {
      const {
        amount,
        stripe: {paymentRequest},
        createDonation,
        myNametagId,
        setDonated,
        name,
        occupation,
        employer,
        address1,
        address2,
        city,
        state,
        zip
      } = this.props

      if (!amount) {
        return null
      }

      const preq = paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Donation',
          amount
        }
      })

      preq.on('token', ({complete, token, ...data}) =>
        complete('success')
          .then(() => createDonation({
            amount,
            nametag: myNametagId,
            token: token.id,
            name,
            occupation,
            employer,
            address1,
            address2,
            city,
            state,
            zip
          }))
          .then(setDonated)
      )

      preq.canMakePayment().then(result =>
        this.setState({canMakePayment: !!result})
      )

      this.setState({paymentRequest: preq})
    }
  }

  componentDidMount () {
    this.setPaymentRequest()
  }

  componentDidUpdate (oldProps) {
    if (oldProps.amount !== this.props.amount) {
      this.setPaymentRequest()
    }
  }

  render () {
    const {amount} = this.props
    return <div style={styles.container}>
      {
        amount && <div style={styles.checkout}>
          <CardElement style={{base: {fontSize: '18px'}}} />
          <img style={styles.poweredBy} src='https://s3.amazonaws.com/nametag_images/site/powered_by_stripe.png' />
        </div>
      }
    </div>
  }
}

const {number, shape, func, string} = PropTypes

StripeCheckout.propTypes = {
  amount: number,
  stripe: shape({
    paymentRequest: func.isRequired
  }).isRequired,
  setDonated: func.isRequired,
  name: string,
  occupation: string,
  employer: string,
  address1: string,
  address2: string,
  city: string,
  state: string,
  zip: string
}

export default StripeCheckout

const styles = {
  container: {
    maxWidth: 400,
    width: '100%'
  },
  checkout: {
    paddingBottom: 20,
    minHeight: 20
  },
  poweredBy: {
    width: 100,
    marginTop: 10
  },
  paymentRequest: {
    margin: 10,
    textAlign: 'center'
  }
}
