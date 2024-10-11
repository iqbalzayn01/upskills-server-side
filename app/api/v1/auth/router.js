const express = require('express');
const router = express();
const { loginCms, userLogged } = require('./controller');
const { authenticateUser } = require('../../../middlewares/auth');

router.post('/auth/login', loginCms);
router.get('/users/me', authenticateUser, userLogged);

module.exports = router;
