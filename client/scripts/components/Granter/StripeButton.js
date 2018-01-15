import React, {PropTypes} from 'react'
import constants from '../../constants'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import t from '../../utils/i18n'

const StripeButton = ({granter: {stripe, name, urlCode}, me: {email}}) => {
  let stripeUrl = `https://connect.stripe.com/express/oauth/authorize?client_id=${constants.STRIPE_CLIENT_ID}`
  stripeUrl += `&state=${urlCode}`
  stripeUrl += `&stripe_user[business_name]=${name}`
  stripeUrl += `&stripe_user[email]=${email}`
  return <FlatButton
    href={stripe ? `/granters/${urlCode}/stripe_dash` : stripeUrl}
    label={t(stripe ? 'granter.stripe_dash' : 'granter.stripe_register')}
    icon={
      <FontIcon
        className='material-icons'>
         attach_money
      </FontIcon>
    }
    primary />
}

const {shape, string} = PropTypes

StripeButton.proptypes = {
  granter: shape({
    name: string.isRequired,
    stripe: string,
    urlCode: string.isRequired
  }),
  me: shape({
    email: string.isRequired
  })
}

export default StripeButton
