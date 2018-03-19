module.exports = (req, res, next, conn) => {
  return res.render('index.pug', {title: 'Nametag', description: 'Online chat built for authentic conversations that inspire action.'})
}
