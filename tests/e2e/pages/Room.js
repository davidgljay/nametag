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
  postMessage (message) {
    return this.waitForElementVisible('@compose')
    .setValue('@composeTextInput', message)
    .click('@sendMessageButton')
    .waitForElementVisible('@messageText')
    .assert.containsText('body', message)
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
    composeTextInput: {
      selector: '#composeTextInput'
    },
    sendMessageButton: {
      selector: '#sendMessageButton'
    },
    messageText: {
      selector: '.messageText'
    }
  }
}
