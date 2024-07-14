const express = require('express');
const router = express();
const { create, index, find } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

router.post(
  '/create-payments',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  create
);

router.get(
  '/payments',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  index
);
router.get(
  '/payments/:id',
  authenticateUser,
  authorizeRoles('admin', 'peserta'),
  find
);

module.exports = router;
