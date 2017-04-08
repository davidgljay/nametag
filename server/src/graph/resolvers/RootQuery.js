const RootQuery = {
  rooms: (obj, args, {models: {Rooms}}) => Rooms.getActive(),
  room: (obj, {id}, {models: {Rooms}}) => Rooms.get(id),
  me: (obj, args, {user}) => user,
  granter: (obj, {urlCode}, {models: {BadgeGranters}}) => BadgeGranters.getByUrlCode(urlCode),
  template: (obj, {id}, {models: {BadgeTemplates}}) => BadgeTemplates.get(id)
}

module.exports = RootQuery
