const commands = {
  ready: () => this
      .waitForElementVisible('body', 3000),
  clickRoom: () => this
      .waitForElementVisible('@title')
      .click('@title')
}

module.exports = {
  commands: [commands],
  elements: {
    roomCard: {
      selector: '.roomCard'
    },
    title: {
      selector: '.roomCard .title'
    }
  }
}
