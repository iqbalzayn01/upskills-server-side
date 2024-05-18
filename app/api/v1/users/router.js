const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

router.post('/register', create);

router.get('/users', authenticateUser, authorizeRoles('admin'), index);

router.get(
  '/users/:id',
  authenticateUser,
  authorizeRoles('user', 'admin'),
  find
);

router.put(
  '/users/:id',
  authenticateUser,
  authorizeRoles('user', 'admin'),
  update
);

router.delete('/users/:id', authenticateUser, authorizeRoles('admin'), destroy);

module.exports = router;