const multer =  require('multer')
const multerS3 =  require('multer-storage-s3')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nametag_images',
    destination: 'room_icons/raw',
    mimetype: (req, file, cb) => {cb(null, file.mimetype)},
    filename: (req, file, cb) => {
      cb( null, Date.now() + '-' + file.fieldname )
    }
  })
})
