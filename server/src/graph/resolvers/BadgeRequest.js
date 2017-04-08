const BadgeRequest = {
  nametag: ({nametag}, _, {models: {Nametags}}) => Nametags.get(nametag)
}

module.exports = BadgeRequest
