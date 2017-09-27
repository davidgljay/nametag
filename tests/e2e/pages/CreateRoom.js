const commands = {
  ready () {
    return this
      .waitForElementVisible('body', 3000)
  },
  setTitle (title) {
    return this.waitForElementVisible('@startConvo')
    .setValue('@startConvo', title)
    .click('@tryThis')
  },
  setWelcome (welcome) {
    return this
      .waitForElementVisible('@welcomeField')
      .setValue('@welcomeField', welcome)
      .click('@nextButton')
  },
  makeModNametag (name, bio) {
    return this
      .waitForElementVisible('@editNametag')
      .setValue('@editNametagName', name)
      .getLocationInView('@nextButton')
      .click('@nextButton')
  },
  addNorms (norm) {
    return this
      .waitForElementVisible('@addCustomNorm')
      .setValue('@addCustomNorm', norm)
      .getLocationInView('@nextButton')
      .click('@nextButton')
  },
  createRoom ({title, norm, welcome}, {name, bio}) {
    return this
      .setTitle(title)
      .setWelcome(welcome)
      .addNorms(norm)
      .waitForElementVisible('@publishButton')
      .click('@publishButton')
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
    },
    welcomeField: {
      selector: '#welcomeField'
    },
    roomPreview: {
      selector: '#roomPreview'
    },
    imageSearchInput: {
      selector: '#imageSearchInput'
    },
    nextButton: {
      selector: '#nextButton'
    },
    publishButton: {
      selector: '#publishButton'
    },
    findImageButton: {
      selector: '#findImageButton'
    },
    roomImage: {
      selector: '#roomImage'
    },
    editNametag: {
      selector: '#editNametag'
    },
    editNametagName: {
      selector: '#editNametagName'
    },
    editNametagBio: {
      selector: '#editNametagBio'
    },
    addCustomNorm: {
      selector: '#addCustomNorm'
    }
  }
}
