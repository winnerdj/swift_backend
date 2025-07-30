"use strict";

const router = require('express').Router();
const authPasswordSchemaCheck = require('../schema/authPasswordSchemaCheck');
const { testConnection, loginUser, changePassword, forgotPassword } = require('../controllers/authentication.controller');

router.get('/connection',										testConnection);
router.post('/token/user',										loginUser);
router.post('/password_change',		authPasswordSchemaCheck,	changePassword);
router.post('/forgot_password',									forgotPassword);

module.exports = router;