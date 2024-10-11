const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

const { documentUploadMiddleware } = require('../../../middlewares/multer');

router.post(
  '/upload-documents',
  documentUploadMiddleware.single('file'),
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  create
);

router.get('/documents', authenticateUser, authorizeRoles('admin'), index);

router.get(
  '/documents/:id',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  find
);

router.put(
  '/documents/:id',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  update
);

router.delete(
  '/documents/:id',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  destroy
);

module.exports = router;
