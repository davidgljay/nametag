#!/usr/bin/env node

const https = require('https')
const fs = require('fs')
const express = require('express')
const horizon = require('@horizon/server')
const config = require('./secrets.json')
const path = require('path')

const app = express()

app.use(express.static('/usr/app/dist/'))

const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '..', '.keys', 'horizon-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', '.keys', 'horizon-cert.pem')),
}, app).listen(8181)

const options = {
  project_name: 'Nametag',
  rdb_host: 'rethinkdb',
  // secure: 'yes',
  // key_file: '/usr/.keys/horizon-key.pem',
  // cert_file: '/usr/.keys/horizon-cert.pem',
  // serve_static: 'usr/app/dist',
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

console.log('Listening on port 8181.')
