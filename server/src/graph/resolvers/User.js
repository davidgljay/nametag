const User = {
  badges: (obj, args, {user:{badges}, loaders:{Badges}}) => Badges.get(badges),
  nametags: (obj, args, {user:{nametags}, loaders:{Nametags}}) => Nametags.get(nametags)
}

module.exports = User
