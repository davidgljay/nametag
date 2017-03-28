const RootQuery = {
  rooms: (obj, args, {models: {Rooms}}) => Rooms.getActive(),
  room: (obj, {id}, {models: {Rooms}}) => Rooms.get(id),
  me: (obj, args, {user}) =>  user,
  granter: (obj, {id}, {models: {BadgeGranters}}) => BadgeGranters.get(id),
  badge: (obj, {id}, {models: {Badges}}) => Badges.get(id)
}

module.exports = RootQuery
