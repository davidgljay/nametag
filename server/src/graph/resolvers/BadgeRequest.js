const BadgeRequest = {
  nametag: ({nametag}, _, {models: {Nametags}}) => Nametags.get(nametag),
  template: ({template}, _, {models: {Templates}}) => Templates.get(template)
}

module.exports = BadgeRequest
