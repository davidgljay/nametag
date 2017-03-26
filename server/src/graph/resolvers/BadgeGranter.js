const {ErrNotLoggedIn} = require('../../errors')

const BadgeGranters = {
  badges: ({badges}, _, {user, models: {Badges}}) => Badges.getAll(badges)
}

module.exports = BadgeTemplate
