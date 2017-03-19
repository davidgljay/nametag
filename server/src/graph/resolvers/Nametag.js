const Nametag = {
  badges: ({badges}, args, {models: {Badges}}) => Badges.getAll(badges)
}

module.exports = Nametag
