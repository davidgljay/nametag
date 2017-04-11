const Template = {
  granter: ({granter}, _, {models: {Granters}}) => Granters.get(granter),
  badges: ({id}, _, {models: {Badges}}) => Badges.getTemplateBadges(id)
}

module.exports = Template
