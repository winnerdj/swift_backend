"use strict";

const {
	getAvailableCounter,
	workLogin,
	getLatestActivityByUser
} = require('../controllers/work.controller');

const router = require('express').Router();

router.get('/available-counter', /*validateCreateUserSchema,*/ getAvailableCounter);

router.post('/login', /*validateCreateUserSchema,*/ workLogin);

router.get('/latest-user-activity', /*validateCreateUserSchema,*/ getLatestActivityByUser);

module.exports = router;