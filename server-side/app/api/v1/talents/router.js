const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

router.post(
  '/create-talents',
  authenticateUser,
  authorizeRoles('admin'),
  create
);

router.get('/talents', authenticateUser, authorizeRoles('admin'), index);

router.get('/talents/:id', authenticateUser, authorizeRoles('admin'), find);

router.put('/talents/:id', authenticateUser, authorizeRoles('admin'), update);

router.delete(
  '/talents/:id',
  authenticateUser,
  authorizeRoles('admin'),
  destroy
);

module.exports = router;
