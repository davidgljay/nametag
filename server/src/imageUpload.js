const multer =  require('multer')
const multerS3 =  require('multer-storage-s3')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fetch = require('node-fetch')

module.exports.multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nametag_images',
    destination: 'raw',
    mimetype: (req, file, cb) => {cb(null, file.mimetype)},
    filename: (req, file, cb) => {
      cb( null, Date.now() + '-' + file.fieldname )
    },
  }),
})

module.exports.lambda = (req, res, next) => {
  const {width, height} = req.params
  let body = {
    bucket: 'nametag_images',
    filename: req.files[0].filename,
    width,
  }
  if (height) {
    body.height = height
  }

  const options = {
    method: POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }

  fetch('https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_resize', options)
    .then((res2) => {
      return res2.ok ? res2.json()
        : Promise.reject(next('Error resizing image'))
    })
    .then((json) => {
      res.send(JSON.stringify(json))
    })
}

module.exports.fromUrl = (params)
