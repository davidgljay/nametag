const commands = {
  ready () {
    return this
      .waitForElementVisible('body', 3000)
  },
  clickRoom () {
    return this.waitForElementVisible('@title')
    .click('@title')
  },
  login (user) {
    return this
    .waitForElementVisible('@loginButton')
    .click('@loginButton')
    .waitForElementVisible('@loginForm')
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
    }
  }
}
