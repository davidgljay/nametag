const User = {
  badges: (obj, args, {user:{badges}, loaders:{Badges}}) => badges? Badges.get(badges) : [],
  nametags: (obj, args, {user:{nametags}, loaders:{Nametags}}) => nametags ? Nametags.get(nametags) : []
}

module.exports = User
