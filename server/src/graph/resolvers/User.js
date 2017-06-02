const User = {
  badges: (obj, args, {user: {badges}, models: {Badges}}) => {
    if (!badges) {
      return []
    }
    const badgeIds = Object.keys(badges).reduce((arr, template) => arr.concat(badges[template]), [])
    return Badges.getAll(badgeIds)
  },
  adminTemplates: (obj, args, {user: {badges}, models: {Templates, Granters}}) => {
    if (!badges) {
      return []
    }
    return Granters.getByAdminTemplate(Object.keys(badges))
      .then(granters => Promise.all(granters.map(g => Templates.getGranterTemplates(g.id))))
      .then(templates => {
        let flat = []
        for (var i=0; i < templates.length; i++ ) {
          flat = flat.concat(templates[i])
        }
        return flat
      })
  },
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
