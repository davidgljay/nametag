const commands = {
  ready () {
    return this
      .waitForElementVisible('body', 3000)
  },
  startConvo (title) {
    return this.waitForElementVisible('@convoInput')
      .setValue('@convoInput')
      .click('@startConvo')
  },
  clickRoom () {
    return this.waitForElementVisible('@title')
    .click('@title')
  },
  register (user) {
    return this
    .waitForElementVisible('@loginButton')
    .click('@loginButton')
    .waitForElementVisible('@loginForm')
    .click('@enableRegisterButton')
    .waitForElementVisible('@registerButton')
    .setValue('@emailForm', user.email)
    .setValue('@passForm', user.pass)
    .setValue('@confForm', user.pass)
    .click('@registerButton')
    .waitForElementVisible('@logoutButton')
  },
  registerInRoom (user) {
    return this
      .waitForElementVisible('@roomCard')
      .click('@roomCard')
      .waitForElementVisible('@enableRegisterButton')
      .waitForElementVisible('.roomCard.notFlipping')
      .click('@enableRegisterButton')
      .waitForElementVisible('@registerButton')
      .setValue('@emailForm', user.email)
      .setValue('@passForm', user.pass)
      .setValue('@confForm', user.pass)
      .click('@registerButton')
      .waitForElementVisible('@logoutButton')
  },
  joinRoom () {
    return this
      .waitForElementVisible('@roomCard')
      .click('@roomCard')
      .waitForElementVisible('.roomCard.notFlipping')
      .waitForElementVisible('@joinRoomButton')
      .click('@joinRoomButton')
  }
}

module.exports = {
  commands: [commands],
  elements: {
    roomCard: {
      selector: '.roomCard'
    },
    title: {
      selector: '.roomCard .title'
    },
    loginButton: {
      selector: '#loginButton'
    },
    logoutButton: {
      selector: '#logoutButton'
    },
    loginForm: {
      selector: '#loginForm'
    },
    enableRegisterButton: {
      selector: '#enableRegisterButton'
    },
    submitLoginButton: {
      selector: '#submitLoginButton'
    },
    registerButton: {
      selector: '#registerButton'
    },
    emailForm: {
      selector: '#loginEmail'
    },
    passForm: {
      selector: '#loginPassword'
    },
    confForm: {
      selector: '#loginConfirm'
    },
    createRoomButton: {
      selector: '#createRoomButton'
    },
    joinRoomButton: {
      selector: '#joinRoomButton'
    },
    convoInput: {
      selector: '#convoInput'
    },
    startConvo: {
      selector: '#startConvoButton'
    }
  }
}
