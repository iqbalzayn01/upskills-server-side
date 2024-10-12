const express = require('express');
const router = express();
const { create, index, find, destroy } = require('./controller');
const { imageUploadMiddleware } = require('../../../middlewares/multer');

const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

router.post(
  '/images',
  imageUploadMiddleware.single('image'),
  authenticateUser,
  authorizeRoles('admin'),
  create
);
module.exports = router;

router.get('/images', index);

router.get('/images/:id', find);

router.delete(
  '/images/:id',
  authenticateUser,
  authorizeRoles('admin'),
  destroy
);
