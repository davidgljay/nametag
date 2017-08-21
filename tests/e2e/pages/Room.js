const commands = {
  ready () {
    return this.waitForElementVisible('body', 3000)
  },
  roomJoin (user) {
    return this.waitForElementVisible('@loginForm')
    .click('@enableRegisterButton')
    .waitForElementVisible('@registerButton')
    .setValue('@emailForm', user.email)
    .setValue('@passForm', user.pass)
    .setValue('@confForm', user.pass)
    .click('@registerButton')
    .waitForElementVisible('@joinRoomButton')
    .click('@joinRoomButton')
    .waitForElementVisible('@messages')
  },
  assertLoaded ({title, description, norm}, {bio, name}) {
    return this.waitForElementVisible('#roomTitle')
    .assert.containsText('#roomTitle', title)
    .assert.containsText('@nametags', name)
    .assert.containsText('#norms', norm)
  },
  postWelcome (message) {
    return this.waitForElementVisible('@welcomeModalInput')
    .setValue('@welcomeModalInput', message)
    .click('@welcomeModalSend')
    .waitForElementVisible('@messageText')
    .assert.containsText('@messages', message)
    .waitForElementVisible('#myNametag .bio')
    .assert.containsText('#myNametag .bio', message)
  },
  postMessage (message) {
    return this.waitForElementVisible('@compose')
    .setValue('@composeTextInput', message)
    .click('@sendMessageButton')
    .waitForElementVisible('@messageText')
    .assert.containsText('body', message)
  },
  exitRoom () {
    return this.waitForElementVisible('@close')
    .click('@close')
    .waitForElementVisible('#roomCards')
  }
}

module.exports = {
  commands: [commands],
  elements: {
    nametags: {
      selector: '#nametags'
    },
    compose: {
      selector: '#compose'
    },
    welcome: {
      selector: '.welcome'
    },
    welcomeModalInput: {
      selector: '.welcome #composeTextInput'
    },
    welcomeModalSend: {
      selector: '.welcome #sendMessageButton'
    },
    composeTextInput: {
      selector: '#composeTextInput'
    },
    sendMessageButton: {
      selector: '#sendMessageButton'
    },
    messageText: {
      selector: '.messageText'
    },
    messages: {
      selector: '#messages'
    },
    close: {
      selector: '#backButton'
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
    joinRoomButton: {
      selector: '#joinRoomButton'
    },
    emailForm: {
      selector: '#loginEmail'
    },
    passForm: {
      selector: '#loginPassword'
    },
    confForm: {
      selector: '#loginConfirm'
    }
  }
}
