const BadgeGranter = {
  templates: ({id}, _, {user, models: {Badges}}) => BadgeTemplates.getGranterTemplates(id)
}

module.exports = BadgeGranter
