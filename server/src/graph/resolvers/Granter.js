const Granter = {
  defaultCtaImages: ({defaultCtaImages}) => defaultCtaImages || [],
  defaultActionTypes: ({defaultActionTypes}) => defaultActionTypes || [],
  templates: ({id}, _, {models: {Templates}}) => Templates.getGranterTemplates(id),
  badgeRequests: ({id}, _, {models: {BadgeRequests}}) => BadgeRequests.getByGranterState(id, 'ACTIVE')
}

module.exports = Granter
