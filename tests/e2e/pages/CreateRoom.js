const commands = {
  ready () {
    return this
      .waitForElementVisible('body', 3000)
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
      .getLocationInView('@nextButton')
      .setValue('@addCustomNorm', norm)
      .click('@nextButton')
  },
  addBio (bio, name) {
    return this
      .waitForElementVisible('@bioField')
      .setValue('@editNametagName', name)
      .setValue('@bioField', bio)
      .getLocationInView('@nextButton')
      .click('@nextButton')
  },
  createRoom ({title, norm, welcome}, user) {
    return this
      .setWelcome(welcome)
      .addNorms(norm)
      .addBio(user.bio, user.name)
      .waitForElementVisible('@doneButton')
      .click('@doneButton')
  },
  register (user) {
    return this
    .waitForElementVisible('@registerButton')
    .setValue('@emailForm', user.email)
    .click('@registerButton')
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
    doneButton: {
      selector: '#doneButton'
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
    bioField: {
      selector: '#bioField'
    }
  }
}
