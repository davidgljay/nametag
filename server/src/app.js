#!/usr/bin/env node

const https = require('https')
const fs = require('fs')
const r = require('rethinkdb')
const express = require('express')
const imageUpload = require('./routes/images/imageUpload')
const config = require('./secrets.json')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const graph = require('./graph')
const subscriptions = require('./graph/subscriptions')
const apollo = require('graphql-server-express')
const {local, facebook, twitter, google} = require('./auth')
const errors = require('./errors')
const dbInit = require('./graph/models').init
const passport = require('passport')
const RedisStore = require('connect-redis')(session)
const redis = require('./redis')
const startSubscriptionServer = require('./graph/subscriptions/SubscriptionServer')
const PORT = 8181

process.env.AWS_ACCESS_KEY_ID = config.s3.accessKeyId
process.env.AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey

const app = express()

/* Create HTTPS server */
const server = https.createServer({
  key: fs.readFileSync(path.join('/', 'usr', '.keys', 'privkey.pem')),
  cert: fs.readFileSync(path.join('/', 'usr', '.keys', 'cert.pem')),
  ca: fs.readFileSync(path.join('/', 'usr', '.keys', 'chain.pem'))
}, app).listen(PORT)

/* Use body parser middleware */
app.use(bodyParser.json())

/* Set up sessions. */
const sessionOptions = {
  secret: config.session.secret,
  rolling: true,
  httpOnly: false,
  saveUninitialized: true,
  resave: true,
  unset: 'destroy',
  sameSite: true,
  logErrors: true,
  cookie: {
    secure: false,
    maxAge: null // 2.59e+8 // 48 hours for session token expiry
  },
  store: new RedisStore({
    client: redis.createClient()
  })
}

if (app.get('env') === 'production') {
  // Enable the secure cookie when we are in production mode.
  sessionOptions.cookie.secure = true
}

app.use(session(sessionOptions))
app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('No session initialized')) // handle error
  }
  next() // otherwise continue
})
app.use(passport.initialize())
app.use(passport.session())

/* Get rethinkdb connection */
r.connect({host: 'rethinkdb'})
  .then(conn => {
    /* Auth Providers */
    passport.use('local', local(conn))
    passport.use('facebook', facebook(conn))
    passport.use('twitter', twitter(conn))
    passport.use('google', google(conn))

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

    app.post('/register', local.register(conn))

    dbInit(conn)

    /* Activate graphql subscriptions */
    subscriptions.activate(conn)
    startSubscriptionServer(conn, server)

    app.use('/', (err, req, res, next) => {
      if (err instanceof errors.APIError) {
        res.status(err.status)
        res.json({
          error: err
        })
      } else {
        console.error(err)
        res.json({
          error: err
        })
      }
    })
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

/* Google auth */
app.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
}))
app.get('/auth/google/callback', passport.authenticate('google',
  { successRedirect: '/',
    failureRedirect: '/#login' }))

app.post('/login', (req, res, next) => {
  passport.authenticate('local',
  local.handleLocalCallback(req, res, next))(req, res, next)
})

app.get('/logout',
  (req, res) => {
    req.session.destroy()
    req.logout()
    res.redirect('/')
  }
)

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

// Server sw.js
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join('/usr', 'app', 'public', 'sw.js'))
})

/* All others serve index.html */
app.get('*', (req, res, next) => {
  res.sendFile(path.join('/usr', 'app', 'public', 'index.html'))
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
  (req, res, next) => {
    imageUpload.fromUrl(req.body.width, req.body.height, req.body.url)
      .then(data => res.json(data))
      .catch(err => next(`Uploading image from URL ${err}`))
  })

console.log('Listening on port 8181.')
