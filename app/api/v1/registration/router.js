const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

router.post(
  '/create-registration',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  create
);

router.get(
  '/registration',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  index
);

router.get(
  '/registration/:id',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  find
);

router.put(
  '/registration/:id',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  update
);

router.delete(
  '/registration/:id',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  destroy
);

module.exports = router;
