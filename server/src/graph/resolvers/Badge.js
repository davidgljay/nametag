const {ErrNotLoggedIn} = require('../../errors')

const Badge = {
  template: ({template}, _, {user, models: {BadgeTemplates}}) => {
    if (!user) {
      return Promise.reject(ErrNotLoggedIn)
    }
    return BadgeTemplates.get(template)
  }
}

module.exports = Badge
