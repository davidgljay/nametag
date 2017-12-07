const commands = {
  ready () {
    return this.waitForElementVisible('body', 3000)
  },
  roomJoin (user) {
    return this.waitForElementVisible('@joinRoomButton')
    .click('@joinRoomButton')
    .waitForElementVisible('@messages')
  },
  assertLoaded ({title, description, norm}, {name}) {
    return this.waitForElementVisible('#roomTitle')
    .assert.containsText('#roomTitle', title)
    .waitForElementVisible('@nametags')
    .assert.containsText('@nametags', name)
    .assert.containsText('#norms', norm)
  },
  updateNametag (name) {
    return this.waitForElementVisible('@editNametag')
    .setValue('@editNametagName', name)
  },
  agreeToNorms () {
    return this.waitForElementVisible('@aboutNametagNext')
      .click('@aboutNametagNext')
      .waitForElementVisible('@agreeToNorms')
      .click('@agreeToNorms')
  },
  postWelcome (message) {
    return this.waitForElementVisible('@welcomeModalInput')
    .setValue('@welcomeModalInput', message)
    .click('@welcomeModalSend')
  },
  postMessage (message, i) {
    return this.waitForElementVisible('@compose')
    .setValue('@composeTextInput', message)
    .click('@sendMessageButton')
    .waitForElementPresent(`.messageText:nth-of-type(${i})`)
    .getLocationInView(`.messageText:nth-of-type(${i})`)
    .assert.containsText('body', message)
  },
  exitRoom () {
    return this.waitForElementVisible('@close')
    .click('@close')
    .waitForElementVisible('#roomCards')
  },
  register (user) {
    return this
    .waitForElementVisible('@registerButton')
    .setValue('@emailForm', user.email)
    .click('@registerButton')
  },
  postReply (message) {
    return this.waitForElementVisible('@replyButton')
    .click('@replyButton')
    .waitForElementVisible('@replyTextInput')
    .setValue('@replyTextInput', message)
    .click('@sendMessageButton')
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
    editNametag: {
      selector: '#editNametag'
    },
    editNametagName: {
      selector: '#editNametagName'
    },
    enterRoomButton: {
      selector: '#enterRoomButton'
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
    },
    aboutNametagNext: {
      selector: '#aboutNametagNext'
    },
    agreeToNorms: {
      selector: '#agreeToNorms'
    },
    replyButton: {
      selector: '#replyIcon'
    },
    replyTextInput: {
      selector: '#replyTextInput'
    }
  }
}
