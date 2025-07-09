"use strict";

const router = require('express').Router();
const { getPaginatedUserActivity } = require('../controllers/userActivity.controller');


router.get('/', getPaginatedUserActivity);

module.exports = router;