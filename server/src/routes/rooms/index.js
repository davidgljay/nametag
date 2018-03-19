module.exports = (req, res, next, conn) => {
  const roomId = /\/rooms\/([a-z0-9-]{36})/.exec(req.url)[1]
  return db.table('rooms').getAll(roomId)
  .eqJoin('mod', db.table('nametags'))
  .zip()
  .run(conn)
    .then(cursor => cursor.toArray())
    .then(([result]) => {
      if (!result) {
        res.render('404.pug')
      } else {
        res.render('index.pug', {title: result.title, image: result.image, description: result.bio})
      }
    })
    .catch(next)
}
