#!/usr/bin/env node

const https = require('https')
const fs = require('fs')
const express = require('express')
const imageUpload = require('./imageUpload')
const horizon = require('../../horizon/server/src/horizon.js')
const config = require('./secrets.json')
const path = require('path')
const listeners = require('./listeners')

process.env.AWS_ACCESS_KEY_ID = config.s3.accessKeyId
process.env.AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey

const app = express()

app.post('/api/images', imageUpload.any(), (req, res) => {
  res.send(req.files[0].filename)
})
app.use(express.static('/usr/app/dist/'))

const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '..', '..', '.keys', 'horizon-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', '..', '.keys', 'horizon-cert.pem')),
}, app).listen(8181)

const options = {
  project_name: 'nametag',
  rdb_host: 'rethinkdb',
  auto_create_collection: 'true',
  auto_create_index: 'true',
  auth: {
    allow_anonymous: false,
    duration: '30d',
    allow_unauthenticated: true,
    success_redirect: '/',
    create_new_users: true,
    new_user_group: 'authenticated',
    token_secret: config.token_secret,
  },
}
const horizonServer = horizon(httpsServer, options)

horizonServer.add_auth_provider(horizon.auth.twitter, config.twitter)
horizonServer.add_auth_provider(horizon.auth.facebook, config.facebook)
horizonServer.add_auth_provider(horizon.auth.google, config.google)

// Activate db listeners
listeners(horizonServer._reql_conn._rdb_options)

console.log('Listening on port 8181.')
