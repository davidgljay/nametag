const Nametag = {
  badges: ({badges}, args, {loaders: {Badges}}) => Badges.getAll(badges)
}

module.exports = Nametag
