const User = {
  badges: (obj, args, {user: {badges}, models: {Badges}}) => badges ? Badges.getAll(badges) : [],
  nametags: (obj, args, {user: {nametags}, models: {Nametags}}) => {
    if (!nametags) {
      return []
    }
    const nametagIds = Object.keys(nametags).reduce((arr, room) => arr.concat(nametags[room]), [])
    return Nametags.getAll(nametagIds)
  }
}

module.exports = User
