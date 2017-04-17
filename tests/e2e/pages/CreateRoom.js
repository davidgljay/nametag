const commands = {
  ready() {
    return this
      .waitForElementVisible('body', 3000);
  },
  fillTitle(title, description) {
    return this
      .waitForElementVisible('@titleField')
      .setValue('@titleField', title)
      .setValue('@descriptionField', description)
  }
}

module.exports = {
  commands: [commands],
  elements: {
    titleField: {
      selector: '#titleField'
    },
    descriptionField: {
      selector: '#descriptionField'
    }
  }
}
