const Granter = {
  templates: ({id}, _, {models: {Templates}}) => Templates.getGranterTemplates(id),
  badgeRequests: ({id}, _, {models: {BadgeRequests}}) => BadgeRequests.getByGranterState(id, 'ACTIVE')
}

module.exports = Granter
