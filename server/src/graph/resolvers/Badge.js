const Badge = {
  template: ({template}, _, {models: {BadgeTemplates}}) => BadgeTemplates.get(template),
  defaultNametag: ({id}, _, {models: {Nametags}}) => Nametags.getByBadge(id)
}

module.exports = Badge
