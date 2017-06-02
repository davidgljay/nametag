const User = {
  badges: (obj, args, {user: {badges}, models: {Badges}}) => {
    if (!badges) {
      return []
    }
    const badgeIds = Object.keys(badges).reduce((arr, template) => arr.concat(badges[template]), [])
    return Badges.getAll(badgeIds)
  },
  adminTemplates: (obj, args, {models: {Users}}) => Users.getAdminTemplates(),
  nametags: (obj, args, {user: {nametags}, models: {Nametags}}) => {
    if (!nametags) {
      return []
    }
    const nametagIds = Object.keys(nametags).reduce((arr, room) => arr.concat(nametags[room]), [])
    return Nametags.getAll(nametagIds)
  },
  granters: (obj, args, {user: {badges}, models: {Granters}}) => {
    if (!badges) {
      return []
    }
    return Granters.getByAdminTemplate(Object.keys(badges))
  }
}

module.exports = User
