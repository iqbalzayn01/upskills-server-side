const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Direktori untuk dokumen
const documentUploadDirectory = path.join(
  __dirname,
  '../../public/uploads/documents/'
);
if (!fs.existsSync(documentUploadDirectory)) {
  fs.mkdirSync(documentUploadDirectory, { recursive: true });
}

// Direktori untuk gambar
const imageUploadDirectory = path.join(
  __dirname,
  '../../public/uploads/images/'
);
if (!fs.existsSync(imageUploadDirectory)) {
  fs.mkdirSync(imageUploadDirectory, { recursive: true });
}

// Konfigurasi untuk dokumen
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, documentUploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 99999999) + '-' + file.originalname);
  },
});

const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
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

// Konfigurasi untuk gambar
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 99999999) + '-' + file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
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

// Inisialisasi multer untuk dokumen
const documentUploadMiddleware = multer({
  storage: documentStorage,
  limits: {
    fileSize: 20000000, // 20 mb
  },
  fileFilter: documentFileFilter,
});

// Inisialisasi multer untuk gambar
const imageUploadMiddleware = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5000000, // 5 mb
  },
  fileFilter: imageFileFilter,
});

module.exports = { documentUploadMiddleware, imageUploadMiddleware };
