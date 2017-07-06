const commands = {
  ready () {
    return this
      .waitForElementVisible('body', 3000)
  },
  fillTitle (title, description) {
    return this
      .waitForElementVisible('@roomPreview')
      .getLocationInView('@descriptionField')
      .setValue('@titleField', title)
      .setValue('@descriptionField', description)
      .getLocationInView('@nextButton')
      .click('@nextButton')
  },
  chooseImage (imageSearch) {
    return this
      .waitForElementVisible('@imageSearchInput')
      .setValue('@imageSearchInput', imageSearch)
      .click('@findImageButton')
      .waitForElementVisible('.imageSearchResult')
      .click('.imageSearchResult')
      .waitForElementVisible('@roomImage')
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
  createRoom ({title, description, imageSearch, norm}, {name, bio}) {
    return this
      .fillTitle(title, description)
      .chooseImage(imageSearch)
      .makeModNametag(name, bio)
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
