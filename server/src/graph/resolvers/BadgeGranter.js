const BadgeGranter = {
  badges: ({badges}, _, {user, models: {Badges}}) => Badges.getAll(badges)
}

module.exports = BadgeGranter
