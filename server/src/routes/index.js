module.exports = (req, res, next, conn) =>
  res.render(req.user ? 'index.pug' : 'landing.pug', {title: 'Nametag', description: 'Mobilize supporters through meaningful conversation..'})
