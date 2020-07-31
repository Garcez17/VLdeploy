const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const tmpFolder = path.resolve(__dirname, '..', '..', 'uploads');

module.exports = {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(req, file, cb) {
      const hash = crypto.randomBytes(6).toString('hex');

      const newImage = file.originalname.replace(/[ ]/g, "-");

      const fileName = `${hash}-${newImage}`;

      cb(null, fileName);
    }
  })
}
