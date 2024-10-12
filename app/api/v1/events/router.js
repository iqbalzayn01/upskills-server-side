const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

router.post(
  '/create-events',
  authenticateUser,
  authorizeRoles('admin'),
  create
);

router.get('/events', index);

router.get('/events/:id', find);

router.put('/events/:id', authenticateUser, authorizeRoles('admin'), update);

router.delete(
  '/events/:id',
  authenticateUser,
  authorizeRoles('admin'),
  destroy
);

module.exports = router;
