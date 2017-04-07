const BadgeGranter = {
  templates: ({id}, _, {models: {BadgeTemplates}}) => BadgeTemplates.getGranterTemplates(id),
  badgeRequests: ({id}, _, {models: {BadgeRequests}}) => BadgeRequests.getByGranter(id)
}

module.exports = BadgeGranter
