const Badge = {
  template: ({template}, _, {models: {Templates}}) => Templates.get(template),
  defaultNametag: ({defaultNametag}, _, {models: {Nametags}}) => Nametags.get(defaultNametag)
}

module.exports = Badge
