const Nametag = {
  badges: ({badges}, args, {models: {Badges}}) => badges ? Badges.getAll(badges) : []
}

module.exports = Nametag
