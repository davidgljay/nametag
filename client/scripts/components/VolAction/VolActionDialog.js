import React, {Component, PropTypes} from 'react'
import Dialog from 'material-ui/Dialog'
import FontIcon from 'material-ui/FontIcon'
import {List, ListItem} from 'material-ui/List'
import NametagIcon from '../Nametag/NametagIcon'
import {primary} from '../../../styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import ChooseAmount from '../Donation/ChooseAmount'

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
      const {checkedActions} = this.state
      const {createVolActions, myNametagId} = this.props
      createVolActions(checkedActions, myNametagId, null)
        .then(this.setState({signedUp: true}))
    }
  }

  render () {
    const {
      open,
      closeDialog,
      room: {
        ctaImage,
        ctaText,
        thankText,
        actionTypes,
        granter}
      } = this.props
    const {checkedActions, donated, signedUp, amount} = this.state

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
          <div style={styles.ctaText}>
            {ctaText}
          </div>
        </div>
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
          granter.stripe &&
          <div style={styles.donationContainer}>
            <h3>Can you also make a donation?</h3>
            <ChooseAmount
              selectAmount={this.selectAmount}
              selectedAmount={amount} />
          </div>
        }
        <div style={styles.buttonContainer}>
          <RaisedButton
            primary
            onClick={this.onSignupClick}
            label='SIGN ME UP!' />
        </div>
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
  closeDialog: func.isRequired,
  createVolActions: func.isRequired,
  myNametagId: string.isRequired
}

export default VolActionDialog

const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20
  },
  bodyStyle: {},
  cta: {
    display: 'flex'
  },
  ctaText: {
    flex: 1,
    fontStyle: 'italic'
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
