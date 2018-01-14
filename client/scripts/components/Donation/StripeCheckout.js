import React, {Component, PropTypes} from 'react'
import {CardElement, PaymentRequestButtonElement} from 'react-stripe-elements'

class StripeCheckout extends Component {

  constructor (props) {
    super(props)

    this.state = {
      canMakePayment: false,
      paymentRequest: null
    }

    this.setPaymentRequest = () => {
      const {
        amount,
        stripe: {paymentRequest},
        createDonation,
        myNametagId,
        setDonated
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
          .then(() => createDonation(amount, myNametagId, token.id))
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
    const {paymentRequest, canMakePayment} = this.state
    return <div style={styles.container}>
      {
        amount && <div style={styles.checkout}>
          {
            paymentRequest && canMakePayment &&
            <PaymentRequestButtonElement
              paymentRequest={paymentRequest}
              className='PaymentRequestButton' />
          }
          <CardElement style={{base: {fontSize: '18px'}}} />
          <img style={styles.poweredBy} src='https://s3.amazonaws.com/nametag_images/site/powered_by_stripe.png' />
        </div>
      }
    </div>
  }
}

const {number, shape, func} = PropTypes

StripeCheckout.propTypes = {
  amount: number,
  stripe: shape({
    paymentRequest: func.isRequired
  }).isRequired,
  setDonated: func.isRequired
}

export default StripeCheckout

const styles = {
  container: {
    width: 400
  },
  checkout: {
    paddingBottom: 20,
    minHeight: 20
  },
  poweredBy: {
    width: 100,
    marginTop: 10
  }
}
