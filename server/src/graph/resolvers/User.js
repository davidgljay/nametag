const User = {
  badges: (obj, args, {user: {badges}, models: {Badges}}) => badges ? Badges.get(badges) : [],
  nametags: (obj, args, {user: {nametags}, models: {Nametags}}) => nametags ? Nametags.get(nametags) : []
}

module.exports = User
