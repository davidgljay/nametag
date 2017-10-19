import React, {PropTypes, Component} from 'react'
import FlatButton from 'material-ui/FlatButton'
import Badge from '../Badge/Badge'
import radium from 'radium'
import {grey} from '../../../styles/colors'
import {mobile} from '../../../styles/sizes'

class BadgeOffer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: 1
    }
  }

  render () {
    const {template, donationAmounts} = this.props
    return <div>
      <div style={styles.badgeOffer}>
        <div>You have been offered the</div>
        <div style={{width: 191}}>
          <Badge badge={{
            template,
            notes: [],
            id: 'temp'
          }} />
        </div>
        <div>badge, which will give you access to exclusive conversations.</div>
      </div>
      <div style={styles.ask}>
        {
          `Now's a great time to show your support for ${template.granter.name}, would you like to make a suggested donation?`
        }
      </div>
      <div style={styles.donationContainer}>
        <div id='donation' style={styles.donation}>
          {
            donationAmounts.map((amount, i) => {
              let donationStyle = styles.donationOption
              if (i === this.state.selected) {
                donationStyle = {
                  ...donationStyle,
                  ...styles.selected
                }
              }
              return <div
                key={i}
                style={donationStyle}
                onClick={() => this.setState({selected: i})}
                >
                ${amount}
              </div>
            })
        }
          <div style={styles.donationOptionLast}>$__</div>
        </div>
        <FlatButton
          primary
          label='Sounds Great!' />
      </div>
    </div>
  }
}

const {string, shape, arrayOf, number} = PropTypes

BadgeOffer.proptypes = {
  template: shape({
    id: string.isRequired,
    granter: shape({
      id: string.isRequired,
      name: string.isRequired
    })
  }),
  donationAmounts: arrayOf(number).isRequired
}

export default radium(BadgeOffer)

const styles = {
  badgeOffer: {
    fontWeight: 300,
    color: grey,
    display: 'flex',
    lineHeight: '30px',
    marginTop: 10,
    [mobile]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  ask: {
    color: grey,
    fontWeight: 300,
    marginTop: 15
  },
  donationContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 20,
    [mobile]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  donation: {
    borderRadius: 3,
    border: `1px solid ${grey}`,
    display: 'flex',
    fontWeight: '300',
    marginRight: 10
  },
  donationOption: {
    padding: 8,
    borderRight: `1px solid ${grey}`,
    cursor: 'pointer'
  },
  donationOptionLast: {
    padding: 8,
    cursor: 'pointer'
  },
  selected: {
    backgroundColor: 'lightgrey'
  }
}
