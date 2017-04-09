const User = {
  badges: (obj, args, {user: {badges}, models: {Badges}}) => {
    if (!badges) {
      return []
    }
    const badgeIds = Object.keys(badges).reduce((arr, template) => arr.concat(badges[template]), [])
    return Badges.getAll(badgeIds)
  },
  nametags: (obj, args, {user: {nametags}, models: {Nametags}}) => {
    if (!nametags) {
      return []
    }
    const nametagIds = Object.keys(nametags).reduce((arr, room) => arr.concat(nametags[room]), [])
    return Nametags.getAll(nametagIds)
  }
}

module.exports = User
