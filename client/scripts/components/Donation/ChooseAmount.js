import React, {PropTypes} from 'react'
import {grey} from '../../../styles/colors'

const donationAmounts = [10, 25, 50]

const onUpdateCustom = (selectAmount) => (e) => {
  selectAmount(e.target.value)()
}

const ChooseAmount = ({selectedAmount, selectAmount}) =>
  <div style={styles.donationContainer}>
    <div id='donation' style={styles.donation}>
      {
         donationAmounts.map((amount, i) => {
           let donationStyle = styles.donationOption
           if (amount === selectedAmount) {
             donationStyle = {
               ...donationStyle,
               ...styles.selected
             }
           }
           return <div
             key={i}
             style={donationStyle}
             onClick={amount === selectedAmount ? selectAmount(null) : selectAmount(amount)} >
             ${amount}
           </div>
         })
     }
      <div style={
        donationAmounts.indexOf(selectedAmount) === -1 &&
          selectedAmount
          ? {
            ...styles.donationOptionLast,
            ...styles.selected
          }
          : styles.donationOptionLast
        }>
        $
        <input
          type='number'
          step='5'
          id='customAmount'
          min='0'
          onBlur={onUpdateCustom(selectAmount)}
          style={styles.customInput} />
      </div>
    </div>
  </div>

const {func} = PropTypes

ChooseAmount.proptypes = {
  setAmount: func.isRequired
}

export default ChooseAmount

const styles = {
  donationContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 20
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
    backgroundColor: 'rgba(18, 114, 106, .25)',
    fontWeight: 700
  },
  customInput: {
    border: 'none',
    fontSize: '16px',
    borderBottom: `1px solid ${grey}`,
    width: 40,
    background: 'rgba(0,0,0,0)'
  }
}
