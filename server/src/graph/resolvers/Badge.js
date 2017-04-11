const Badge = {
  template: ({template}, _, {models: {Templates}}) => Templates.get(template),
  defaultNametag: ({id}, _, {models: {Nametags}}) => Nametags.getByBadge(id)
}

module.exports = Badge
