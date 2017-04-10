const BadgeRequest = {
  nametag: ({nametag}, _, {models: {Nametags}}) => Nametags.get(nametag),
  template: ({template}, _, {models: {BadgeTemplates}}) => BadgeTemplates.get(template)
}

module.exports = BadgeRequest
