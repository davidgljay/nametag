#!/usr/bin/env node

const execSync = require('child_process').execSync
const https = require('https')
const fs = require('fs')
const r = require('rethinkdb')
const express = require('express')
const imageUpload = require('./routes/images/imageUpload')
const imageRedirect = require('./routes/images/imageRedirect')
const stripeAuth = require('./routes/granters/stripeAuth')
const stripeDash = require('./routes/granters/stripeDash')
const contactForm = require('./routes/contact/contact')
const roomsRoute = require('./routes/rooms')
const embedRoute = require('./routes/granters/embed')
const shortLinkRoute = require('./routes/r')
const homeRoute = require('./routes')
const config = require('./secrets.json')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const graph = require('./graph')
const subscriptions = require('./graph/subscriptions')
const apollo = require('graphql-server-express')
const {local, facebook, twitter, google, authCallback, hash} = require('./auth')
const errors = require('./errors')
const Context = require('./graph/context')
const {db} = require('./db')
const dbInit = require('./graph/models').init
const passport = require('passport')
const RDBStore = require('./rdbSessions')(session)
const Raven = require('raven')
const startSubscriptionServer = require('./graph/subscriptions/SubscriptionServer')
const PORT = 8181

const GIT_HASH = execSync('git rev-parse HEAD', {
  cwd: path.join(__dirname, '../..')
}).toString().trim()

process.env.AWS_ACCESS_KEY_ID = config.s3.accessKeyId
process.env.AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey

Raven.config(config.sentry.dsn, {
  tags: {git_commit: GIT_HASH},
  environment: process.env.NODE_ENV
}).install()

const app = express()

/* Create HTTPS server */
const server = https.createServer({
  key: fs.readFileSync(path.join('/', 'usr', '.keys', 'privkey.pem')),
  cert: fs.readFileSync(path.join('/', 'usr', '.keys', 'cert.pem')),
  ca: fs.readFileSync(path.join('/', 'usr', '.keys', 'chain.pem'))
}, app)

/* Send errors to Sentry */
app.use(Raven.requestHandler())

/* Use body parser middleware */
app.use(bodyParser.json())

/* Serve static files */
app.use('/public', express.static(path.join('/usr', 'client', 'public')))

// Server sw.js
app.get('/firebase-messaging-sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript')
  res.sendFile(path.join('/usr', 'client', 'public', 'firebase-messaging-sw.js'))
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join('/usr', 'client', 'public', 'favicon.ico'))
})

/* Serve well-known files */
app.use('/.well-known', express.static(path.join('/usr', 'client', 'public', 'well-known')))

/* Upload an image and return the url of that image on S3 */
app.post('/api/images',
    imageUpload.multer.any(),
    (req, res) => {
      res.json({url: req.files[0].location})
    }
)

/* Redirect to an image (used to securely deliver images hosted via http) */
app.get('/api/image_redirect',
  (req, res) => {
    imageRedirect.redirect(decodeURIComponent(req.query.url), res)
      .catch(err => console.error('Redirecting image', err))
  }
)

/* Upload an image from a url and return the location of that image on S3 */
app.post('/api/image_url',
  (req, res, next) => {
    imageUpload.fromUrl(req.body.width, req.body.height, req.body.url)
      .then(data => res.json(data))
      .catch(err => next(`Uploading image from URL ${err}`))
  })

/* Accepts input from the contact form */
app.post('/api/contact_form',
  (req, res, next) => {
    contactForm(req.body)
      .then(() => res.status(200).end())
      .catch(err => next(`Error posting to contact form ${err}`))
  })

/* Get rethinkdb connection */
r.connect({host: 'rethinkdb'})
  .then(conn => {
    /* Session Management */
    const rdbStore = new RDBStore({
      conn: conn,
      table: 'sessions',
      db: 'sessions',
      sessionTimeout: 2629746000,
      flushInterval: 60000,
      debug: false
    })

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
        maxAge: 2629746000 // 1 month in milliseconds
      },
      store: rdbStore
    }

    if (app.get('env') === 'production') {
      // Enable the secure cookie when we are in production mode.
      sessionOptions.cookie.secure = true
    }

    app.use(session(sessionOptions))
    app.use((req, res, next) => {
      if (!req.session) {
        return next(new Error('No session initialized'))
      }
      next()
    })
    app.use(passport.initialize())
    app.use(passport.session())

    /* User session serialization */
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })

    passport.deserializeUser((id, done) =>
      db.table('users').get(id).run(conn)
        .then(user => done(null, user))
        .catch(done)
    )

    /* Auth Providers */
    // passport.use('local', local(conn))
    passport.use('hash', hash(conn))
    passport.use('facebook', facebook(conn))
    passport.use('twitter', twitter(conn))
    passport.use('google', google(conn))

    // GraphQL endpoint.
    app.use('/api/v1/graph/ql', apollo.graphqlExpress(graph.createGraphOptions(conn)))

    app.post('/register', local.register(conn))

    /* Activate graphql subscriptions */
    subscriptions.activate(conn)
    startSubscriptionServer(conn, server)

    /* Facebook auth */
    app.get('/auth/facebook', passport.authenticate('facebook',
      {
        display: 'popup',
        authType: 'rerequest',
        scope: ['public_profile', 'email'],
        profileFields: ['id', 'displayName', 'picture']
      }))
    app.get('/auth/facebook/callback', (req, res, next) =>
      passport.authenticate('facebook',
        authCallback(req, res, next, conn)
      )(req, res, next))

    /* Twitter auth */
    app.get('/auth/twitter', passport.authenticate('twitter'))
    app.get('/auth/twitter/callback', (req, res, next) =>
        passport.authenticate('twitter',
        authCallback(req, res, next, conn)
      )(req, res, next))

    /* Google auth */
    app.get('/auth/google', passport.authenticate('google', {
      scope: ['openid', 'profile', 'email']
    }))
    app.get('/auth/google/callback', (req, res, next) =>
      passport.authenticate('google',
        authCallback(req, res, next, conn)
      )(req, res, next))

    // Local login with username and password
    // app.post('/login', (req, res, next) => {
    //   passport.authenticate('local',
    //   local.handleLocalCallback(req, res, next))(req, res, next)
    // })

    // Local login with a token
    app.get('/login/:hash', (req, res, next) => {
      passport.authenticate('hash',
      hash.handleHashCallback(req, res, next))(req, res, next)
    })

    // Send an e-mail digest
    app.get('/send_digest', (req, res, next) => {
      if (req.headers.authorization !== config.digest.key) {
        next(errors.ErrNotAuthorized)
      } else {
        const context = new Context({}, conn)
        context.models.Users.emailDigest()
          .then(() => res.end())
          .catch(err => next(new errors.APIError(err)))
      }
    })

    app.get('/stripe_auth', (req, res, next) => {
      if (!req.query.code) {
        next(errors.ErrInvalidToken)
      } else {
        const context = new Context({}, conn)
        stripeAuth(context, req.query.state, req.query.code)
          .then(() => res.redirect(`/granters/${req.query.state}`))
          .catch(next)
      }
    })

    app.get('/granters/:granter/stripe_dash', (req, res, next) => {
      const context = new Context({}, conn)
      stripeDash(context, req.params.granter, req.user)
        .then(({url}) => res.redirect(url))
        .catch(next)
    })

    app.get('/granters/:granter/embed', (req, res, next) => {
      const context = new Context({}, conn)
      embedRoute(req, res, next)
    })

    app.get('/logout',
      (req, res) => {
        req.session.destroy()
        req.logout()
        res.redirect('/')
      })

    /* All others serve index.html */
    app.get('*', (req, res, next) => {
      const context = new Context({}, conn)
      if (req.query.loginHash) {
        return context.models.Users.getByHash(req.query.loginHash)
          .then(user =>
            req.login(user, (err) => {
              if (err) {
                return next(err)
              }
              res.redirect(req.url.replace(/loginHash=[^&]+[&]*/, ''))
            })
            )
          .catch(() =>
            res.redirect(req.url.replace(/loginHash=[^&]+[&]*/, ''))
          )
      }

      // If loading a room, display key room info in a template
      if (/\/rooms\/[a-z0-9-]{36}/.test(req.url)) {
        roomsRoute(req, res, next, conn)
      } else if (/\/r\/[^/]+/.test(req.url)) {
        shortLinkRoute(req, res, next, conn)
      } else {
        homeRoute(req, res, next, conn)
      }
    })

    app.use(Raven.errorHandler())
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

    // Now that the DB connection is established, start listening for connections
    dbInit(conn)
    .then(() => {
      server.listen(PORT)
      console.log(`Listening on port ${PORT}.`)
    })
  })
  .catch(err => console.log(`Error connecting to rethinkdb: ${err}`))

  // ==============================================================================
  // GraphQL Router
  // ==============================================================================

  // Only include the graphiql tool if we aren't in production mode.
  // if (app.get('env') !== 'production') {
  // Interactive graphiql interface.
app.use('/api/v1/graph/iql', apollo.graphiqlExpress({
  endpointURL: '/api/v1/graph/ql'
}))
  // }
