const multer = require('multer')
const multerS3 = require('multer-storage-s3')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const config = require('../../secrets.json')
const fetch = require('node-fetch')
const {LAMBDA_UPLOAD_URL, LAMBDA_RESIZE_URL} = require('../../constants')

module.exports.multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.s3.bucket,
    destination: (req, file, cb) => { cb(null, req.headers.imagewidth) },
    mimetype: (req, file, cb) => { cb(null, file.mimetype) },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.fieldname)
    }
  })
})

module.exports.resize = (width, height, filename) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bucket: config.s3.bucket,
      filename: filename,
      width,
      height
    })
  }

  return fetch(LAMBDA_RESIZE_URL, options)
    .then((res2) => {
      return res2.ok ? res2.json()
        : Promise.reject(new Error('Error resizing image'))
    })
}

module.exports.fromUrl = (width, height, url) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      width,
      height
    })
  }

  return fetch(LAMBDA_UPLOAD_URL, options)
    .then((res) => {
      return res.ok ? res.json()
        : Promise.reject(res.statusCode)
    })
}
