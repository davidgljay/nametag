const {ErrNotLoggedIn} = require('../../errors')

const Badge = {
  template: ({template}, _, {user, models: {BadgeTemplates}}) => BadgeTemplates.get(template)
}

module.exports = Badge
