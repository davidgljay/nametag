const User = {
  badges: (_, __, context, loaders) => {
    return loaders.Badges.get(context.user.badges)
  }
}

module.exports = User
