#!/usr/bin/env node

const https = require('https')
const fs = require('fs')
const r = require('rethinkdb')
const express = require('express')
const imageUpload = require('./routes/images/imageUpload')
const horizon = require('../horizon/server/src/horizon.js')
const config = require('./secrets.json')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const listeners = require('./listeners')
const graph = require('./graph')
const Connection = require('./connection')
const apollo = require('graphql-server-express')
const {local, facebook, twitter} = require('./auth')
const passport = require('passport')

process.env.AWS_ACCESS_KEY_ID = config.s3.accessKeyId
process.env.AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey

const app = express()

/* Create HTTP server */
const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '..', '..', '.keys', 'privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', '..', '.keys', 'cert.pem')),
  ca: fs.readFileSync(path.join(__dirname, '..', '..', '.keys', 'chain.pem'))
}, app).listen(8181)

/* Use body parser middleware */
app.use(bodyParser.json())
app.use(session({ secret: config.session.secret }))
app.use(passport.initialize())
app.use(passport.session())

/* Get rethinkdb connection */
r.connect( {host: 'rethinkdb'})
  .then(conn => {

    /* Auth Providers */
    passport.use('local', local(conn))
    passport.use('facebook', facebook(conn))
    passport.use('twitter', twitter(conn))

    /* User session serialization */
    passport.serializeUser((user, done) => {
         done(null, user.id)
     })

     passport.deserializeUser((id, done) => {
       r.db('nametag').table('users').get(id).run(conn)
        .then(user => done(null, user))
        .catch(done)
     })

    // GraphQL endpoint.
    app.use('/api/v1/graph/ql', apollo.graphqlExpress(graph.createGraphOptions(conn)))

  })
  .catch(err => console.log(`Error connecting to rethinkdb: ${err}`))



/* Serve static files */
app.use('/public', express.static(path.join('/usr', 'app', 'public')))


/* Facebook auth */
app.get('/auth/facebook', passport.authenticate('facebook',
  {
    display: 'popup',
    authType: 'rerequest',
    scope: ['public_profile'],
    profileFields: ['id', 'displayName', 'email', 'picture']
  }))
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/',
    failureRedirect: '/#login' }))

/* Twitter auth */
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter',
  { successRedirect: '/',
    failureRedirect: '/#login' }))

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/#login',
                                   successFlash: 'Welcome!',
                                   failureFlash: 'Email or password is invalid.' })
);

/* Connect to Horizon */
// const options = {
//   project_name: 'nametag',
//   rdb_host: 'rethinkdb',
//   auto_create_collection: 'true',
//   auto_create_index: 'true',
//   auth: {
//     allow_anonymous: false,
//     duration: '30d',
//     allow_unauthenticated: true,
//     success_redirect: '/',
//     create_new_users: true,
//     new_user_group: 'authenticated',
//     token_secret: config.token_secret
//   }
// }
// const horizonServer = horizon(httpsServer, options)
//
// /* Enable Auth providers */
// horizonServer.add_auth_provider(horizon.auth.twitter, config.twitter)
// horizonServer.add_auth_provider(horizon.auth.facebook, config.facebook)
// horizonServer.add_auth_provider(horizon.auth.google, config.google)

/* Activate db listeners */
// listeners(horizonServer._reql_conn._rdb_options)

// ==============================================================================
// GraphQL Router
// ==============================================================================


// Only include the graphiql tool if we aren't in production mode.
if (app.get('env') !== 'production') {
  // Interactive graphiql interface.
  app.use('/api/v1/graph/iql', apollo.graphiqlExpress({
    endpointURL: '/api/v1/graph/ql'
  }))
}

  // GraphQL documention.
  // app.get('/admin/docs', (req, res) => {
  //   res.render('admin/docs');
  // });
// }
/* Serve index.html */
app.get('*', (req, res, next) => {
  if (req.url === '/sw.js') {
    res.sendFile(path.join('/usr', 'app', 'public', 'sw.js'))
  } else {
    res.sendFile(path.join('/usr', 'app', 'public', 'index.html'))
  }
})

/* Upload an image and return the url of that image on S3 */
app.post('/api/images',
  imageUpload.multer.any(),
  (req, res) => {
    imageUpload.resize(req.query.width, req.query.height, req.files[0].filename)
      .then(data => res.json(data))
      .catch(err => console.error('Uploading image', err))
  }
)

/* Upload an image from a url and return the location of that image on S3 */
app.post('/api/image_url',
  (req, res) => {
    imageUpload.fromUrl(req.body.width, req.body.height, req.body.url)
      .then(data => res.json(data))
      .catch(err => console.error('Uploading image from URL', err))
  })

console.log('Listening on port 8181.')
