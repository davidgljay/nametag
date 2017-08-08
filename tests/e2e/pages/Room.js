const commands = {
  ready () {
    return this.waitForElementVisible('body', 3000)
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
    .assert.containsText('@nametags', message)
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
    }
  }
}
