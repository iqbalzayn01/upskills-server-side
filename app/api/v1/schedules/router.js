const express = require('express');
const router = express();
const { create, index, find, update, destroy } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

router.post(
  '/create-schedules',
  authenticateUser,
  authorizeRoles('admin'),
  create
);

router.get('/schedules', index);

router.get('/schedules/:id', find);

router.put('/schedules/:id', authenticateUser, authorizeRoles('admin'), update);

router.delete('/schedules/:id', authenticateUser, destroy);

module.exports = router;
