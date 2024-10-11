const multer = require('multer');

// documents config
const documentStorage = multer.memoryStorage();

const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      {
        msg: 'Format file tidak didukung untuk dokumen. Format yang diizinkan hanya: PDF',
      },
      false
    );
  }
};

// images config
const imageStorage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      {
        msg: 'Format file tidak didukung untuk gambar. Format yang diizinkan: JPEG, JPG, PNG',
      },
      false
    );
  }
};

// init documents
const documentUploadMiddleware = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10000000, // 10 mb
  },
  fileFilter: documentFileFilter,
});

// init images
const imageUploadMiddleware = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5000000, // 5 mb
  },
  fileFilter: imageFileFilter,
});

module.exports = { documentUploadMiddleware, imageUploadMiddleware };
