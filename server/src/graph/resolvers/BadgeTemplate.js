const {ErrNotLoggedIn} = require('../../errors')

const BadgeTemplate = {
  granter: ({granter}, _, {models: {BadgeGranters}}) => BadgeGranters.get(granter),
  badges: ({id}, _, {models: {Badges}}) => Badges.getTemplateBadges(id)
}

module.exports = BadgeTemplate
